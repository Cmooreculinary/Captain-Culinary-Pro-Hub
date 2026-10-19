import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

export type ConnectionState = "offline" | "connecting" | "ready" | "error";
export type TranscriptEntry = { id: string; role: "chef" | "captain" | "system"; text: string };

type ServerEvent = {
  type?: string;
  text?: string;
  message?: string;
  agent_configured?: boolean;
  provider?: string;
  model?: string;
};

const endpoint = import.meta.env.VITE_COACH_WS_URL || "ws://localhost:8000/ws/coach";

export function useCoach() {
  const [connection, setConnection] = useState<ConnectionState>("offline");
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [runtimeNote, setRuntimeNote] = useState("Connect to check the coaching runtime.");
  const socketRef = useRef<WebSocket | null>(null);
  const speakRef = useRef(speakReplies);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  speakRef.current = speakReplies;

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries, streamingText]);

  useEffect(() => {
    if (videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  const addEntry = (role: TranscriptEntry["role"], text: string) => {
    setEntries((current) => [...current, { id: crypto.randomUUID(), role, text }]);
  };

  const connect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }
    setConnection("connecting");
    const socket = new WebSocket(`${endpoint}/${sessionId}`);
    socketRef.current = socket;

    socket.onclose = () => {
      setConnection("offline");
      setStreamingText("");
    };
    socket.onerror = () => {
      setConnection("error");
      setRuntimeNote("The local coaching socket could not be reached.");
    };
    socket.onmessage = (message) => {
      const event = JSON.parse(message.data) as ServerEvent;
      if (event.type === "ready") {
        setConnection("ready");
        setRuntimeNote(
          event.agent_configured
            ? `Coach online: ${event.provider ?? "unknown"} / ${event.model ?? "model unset"}.`
            : event.provider === "ollama"
              ? "Backend connected. OLLAMA_MODEL still needs an exact local model name."
              : "Backend connected. ANTHROPIC_API_KEY still needs to be set in backend/.env.",
        );
      } else if (event.type === "assistant-start") {
        setStreamingText("");
      } else if (event.type === "text-delta") {
        setStreamingText((current) => current + (event.text || ""));
      } else if (event.type === "assistant-complete") {
        const text = event.text || "";
        if (text) {
          addEntry("captain", text);
          if (speakRef.current && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
          }
        }
        setStreamingText("");
      } else if (event.type === "interruption-ack") {
        setStreamingText("");
        addEntry("system", "Response stopped.");
      } else if (event.type === "camera-frame-ack") {
        addEntry("system", "Camera frame transported. It was not kept and it was not read as a safety or doneness check.");
      } else if (event.type === "error") {
        addEntry("system", event.message || "The coaching runtime returned an error.");
      }
    };
  };

  const sendText = (text: string) => {
    const clean = text.trim();
    if (!clean || socketRef.current?.readyState !== WebSocket.OPEN) return;
    addEntry("chef", clean);
    socketRef.current.send(JSON.stringify({ type: "text-input", text: clean }));
    setInput("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    sendText(input);
  };

  const interrupt = () => {
    window.speechSynthesis?.cancel();
    socketRef.current?.send(JSON.stringify({ type: "interrupt-signal" }));
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      cameraStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      addEntry("system", "Camera permission was not granted.");
    }
  };

  const sendCameraFrame = () => {
    const video = videoRef.current;
    if (!video || !cameraActive || socketRef.current?.readyState !== WebSocket.OPEN) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(video.videoWidth, 1280);
    canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight);
    const context = canvas.getContext("2d");
    if (!context || !canvas.width || !canvas.height) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    socketRef.current.send(
      JSON.stringify({ type: "camera-frame", data_url: canvas.toDataURL("image/jpeg", 0.78) }),
    );
  };

  return {
    connection,
    input,
    setInput,
    entries,
    streamingText,
    cameraActive,
    speakReplies,
    setSpeakReplies,
    runtimeNote,
    videoRef,
    transcriptRef,
    sessionId,
    connect,
    sendText,
    submit,
    interrupt,
    enableCamera,
    sendCameraFrame,
  };
}
