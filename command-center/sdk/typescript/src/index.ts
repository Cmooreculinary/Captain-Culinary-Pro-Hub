export interface CommandManifest {
  service: "captain-culinary-command";
  protocol_version: string;
  endpoints: {
    health: string;
    coaching_websocket: string;
  };
  capabilities: {
    text_streaming: boolean;
    interruption: boolean;
    camera_transport: boolean;
    camera_retention: "none";
    vision_reasoning: boolean;
    audio_input: boolean;
    audio_output: boolean;
    avatar_renderer: boolean;
    automatic_runtime_handoff: boolean;
  };
  safety: {
    one_action_at_a_time: true;
    waits_for_confirmation: true;
    camera_food_safety_claims: false;
    camera_allergen_claims: false;
    camera_doneness_claims: false;
  };
  runtime: {
    provider: string;
    model: string;
    configured: boolean;
  };
  adapters: {
    speech_input: CommandAdapterStatus;
    speech_output: CommandAdapterStatus;
  };
}

export interface CommandAdapterStatus {
  configured: boolean;
  provider: string | null;
  model: string | null;
  mime_types: string[];
}

export interface AudioChunk {
  data: ArrayBuffer;
  mimeType: string;
  sequence: number;
}

export interface TranscriptEvent {
  text: string;
  final: boolean;
}

export interface SpeechInputAdapter {
  readonly provider: string;
  readonly model: string;
  readonly configured: boolean;
  readonly acceptedMimeTypes: readonly string[];
  start(onTranscript: (event: TranscriptEvent) => void): Promise<void>;
  stop(): Promise<void>;
  close(): Promise<void>;
}

export interface SpeechOutputAdapter {
  readonly provider: string;
  readonly model: string;
  readonly configured: boolean;
  readonly outputMimeType: string;
  speak(text: string): Promise<void>;
  interrupt(): Promise<void>;
  close(): Promise<void>;
}

export interface LiveAudioAdapters {
  input: SpeechInputAdapter;
  output: SpeechOutputAdapter;
}

export type CommandServerEvent =
  | {
      type: "ready";
      session_id: string;
      provider: string;
      model: string;
      agent_configured: boolean;
      camera_reasoning: false;
    }
  | { type: "heartbeat-ack" }
  | { type: "assistant-start"; generation: number }
  | { type: "text-delta"; text: string; generation: number }
  | { type: "assistant-complete"; text: string; generation: number }
  | { type: "interruption-ack"; interrupted: boolean; generation: number }
  | {
      type: "camera-frame-ack";
      mime_type: "image/jpeg" | "image/png" | "image/webp";
      byte_count: number;
      retained: false;
      vision_reasoning: false;
    }
  | { type: "error"; code: string; message: string };

export interface CommandClientHandlers {
  onEvent(event: CommandServerEvent): void;
  onConnectionChange?(connected: boolean): void;
  onError?(error: Error): void;
}

export interface CommandClientOptions {
  baseUrl: string;
  sessionId: string;
  handlers: CommandClientHandlers;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function websocketBaseUrl(httpBaseUrl: string): string {
  const url = new URL(httpBaseUrl);
  if (url.protocol === "http:") {
    url.protocol = "ws:";
  } else if (url.protocol === "https:") {
    url.protocol = "wss:";
  } else {
    throw new Error("Command baseUrl must use http or https");
  }
  return trimTrailingSlash(url.toString());
}

export class CapCulCommandClient {
  private readonly baseUrl: string;
  private readonly sessionId: string;
  private readonly handlers: CommandClientHandlers;
  private socket: WebSocket | null = null;

  constructor(options: CommandClientOptions) {
    if (!options.sessionId.trim()) {
      throw new Error("A non-empty sessionId is required");
    }
    this.baseUrl = trimTrailingSlash(options.baseUrl);
    this.sessionId = options.sessionId;
    this.handlers = options.handlers;
  }

  async getManifest(signal?: AbortSignal): Promise<CommandManifest> {
    const requestInit: RequestInit = signal ? { signal } : {};
    const response = await fetch(`${this.baseUrl}/command/v1/manifest`, requestInit);
    if (!response.ok) {
      throw new Error(`Command manifest request failed with status ${response.status}`);
    }
    return (await response.json()) as CommandManifest;
  }

  connect(): void {
    if (this.socket && this.socket.readyState <= WebSocket.OPEN) {
      return;
    }

    const encodedSessionId = encodeURIComponent(this.sessionId);
    const socket = new WebSocket(
      `${websocketBaseUrl(this.baseUrl)}/ws/coach/${encodedSessionId}`,
    );
    this.socket = socket;

    socket.addEventListener("open", () => {
      this.handlers.onConnectionChange?.(true);
    });
    socket.addEventListener("message", (message) => {
      try {
        const event = JSON.parse(String(message.data)) as CommandServerEvent;
        this.handlers.onEvent(event);
      } catch {
        this.handlers.onError?.(new Error("Command server returned an invalid event"));
      }
    });
    socket.addEventListener("error", () => {
      this.handlers.onError?.(new Error("Command WebSocket connection failed"));
    });
    socket.addEventListener("close", () => {
      if (this.socket === socket) {
        this.socket = null;
      }
      this.handlers.onConnectionChange?.(false);
    });
  }

  sendText(text: string): void {
    const normalized = text.trim();
    if (!normalized) {
      throw new Error("Text input is required");
    }
    if (normalized.length > 4000) {
      throw new Error("Text input exceeds 4000 characters");
    }
    this.send({ type: "text-input", text: normalized });
  }

  interrupt(): void {
    this.send({ type: "interrupt-signal" });
  }

  heartbeat(): void {
    this.send({ type: "heartbeat" });
  }

  sendCameraFrame(dataUrl: string): void {
    if (!/^data:image\/(?:jpeg|png|webp);base64,/.test(dataUrl)) {
      throw new Error("Camera frame must be a JPEG, PNG, or WebP data URL");
    }
    this.send({ type: "camera-frame", data_url: dataUrl });
  }

  disconnect(code = 1000, reason = "Client closed the session"): void {
    this.socket?.close(code, reason);
    this.socket = null;
  }

  private send(event: Record<string, unknown>): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("Command WebSocket is not connected");
    }
    this.socket.send(JSON.stringify(event));
  }
}
