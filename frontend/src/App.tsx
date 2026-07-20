import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ConnectionState = "offline" | "connecting" | "ready" | "error";
type TranscriptEntry = { id: string; role: "chef" | "captain" | "system"; text: string };
type ServerEvent = {
  type?: string;
  text?: string;
  message?: string;
  agent_configured?: boolean;
  provider?: string;
  model?: string;
};

const endpoint = import.meta.env.VITE_COACH_WS_URL || "ws://localhost:8000/ws/coach";

function App() {
  const [connection, setConnection] = useState<ConnectionState>("offline");
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [runtimeNote, setRuntimeNote] = useState("Connect to check the coaching runtime.");
  const socketRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries, streamingText]);

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
    if (socketRef.current?.readyState === WebSocket.OPEN) return;
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
              ? "Backend connected; OLLAMA_MODEL still needs an exact local model name."
              : "Backend connected; ANTHROPIC_API_KEY still needs to be set in backend/.env.",
        );
      } else if (event.type === "assistant-start") {
        setStreamingText("");
      } else if (event.type === "text-delta") {
        setStreamingText((current) => current + (event.text || ""));
      } else if (event.type === "assistant-complete") {
        const text = event.text || "";
        if (text) {
          addEntry("captain", text);
          if (speakReplies && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
          }
        }
        setStreamingText("");
      } else if (event.type === "interruption-ack") {
        setStreamingText("");
        addEntry("system", "Response stopped.");
      } else if (event.type === "camera-frame-ack") {
        addEntry("system", "Camera frame transported for the spike. It was not retained or interpreted.");
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

  const connectionLabel = connection === "ready" ? "LINE READY" : connection.toUpperCase();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">BCA / CONTROLLED TECHNICAL SPIKE</p>
          <h1>CAPTAIN CULINARY <span>PRO HUB</span></h1>
        </div>
        <div className={`status status--${connection}`}><i />{connectionLabel}</div>
      </header>

      <section className="work-grid">
        <aside className="rail">
          <p className="section-label">RUN CARD / 001</p>
          <h2>EGG TEST</h2>
          <p className="muted">One narrow coaching exchange. One action at a time. Interrupt at any point.</p>
          <div className="rule" />
          <button className="primary" onClick={connection === "ready" ? () => sendText("Start the egg test") : connect}>
            {connection === "ready" ? "START THE EGG TEST" : "CONNECT LOCAL COACH"}
          </button>
          <button className="danger" onClick={interrupt} disabled={connection !== "ready"}>STOP RESPONSE</button>
          <label className="switch-row">
            <input type="checkbox" checked={speakReplies} onChange={(event) => setSpeakReplies(event.target.checked)} />
            <span>Browser voice playback</span>
          </label>
          <p className="runtime-note">{runtimeNote}</p>
        </aside>

        <section className="console">
          <div className="console-head">
            <p className="section-label">LIVE COACH CHANNEL</p>
            <span>SESSION {sessionId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="transcript" ref={transcriptRef} aria-live="polite">
            {entries.length === 0 && !streamingText && (
              <div className="empty-state">
                <strong>STATION QUIET</strong>
                <p>Connect the local runtime, then start the egg test or enter a direct instruction.</p>
              </div>
            )}
            {entries.map((entry) => (
              <article className={`entry entry--${entry.role}`} key={entry.id}>
                <span>{entry.role === "chef" ? "CHEF" : entry.role === "captain" ? "CAPTAIN" : "SYSTEM"}</span>
                <p>{entry.text}</p>
              </article>
            ))}
            {streamingText && (
              <article className="entry entry--captain entry--streaming"><span>CAPTAIN</span><p>{streamingText}</p></article>
            )}
          </div>
          <form className="command-bar" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Give Captain a direct instruction"
              maxLength={4000}
              disabled={connection !== "ready"}
              aria-label="Coaching instruction"
            />
            <button type="submit" disabled={connection !== "ready" || !input.trim()}>SEND</button>
          </form>
        </section>

        <aside className="vision-panel">
          <div className="vision-head">
            <p className="section-label">CAMERA TRANSPORT</p>
            <span>NO RETENTION</span>
          </div>
          <div className="camera-frame">
            <video ref={videoRef} autoPlay muted playsInline />
            {!cameraActive && <div className="camera-off"><i /><strong>CAMERA OFF</strong></div>}
          </div>
          <button className="secondary" onClick={cameraActive ? sendCameraFrame : enableCamera}>
            {cameraActive ? "SEND ONE FRAME" : "ENABLE CAMERA"}
          </button>
          <div className="license-gate">
            <p className="section-label">AVATAR RENDERER</p>
            <strong>LICENSE GATE ACTIVE</strong>
            <p>No third-party sample character is loaded. A BCA-owned or commercially licensed asset is required.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
