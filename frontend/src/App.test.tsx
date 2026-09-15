// @vitest-environment jsdom
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "./App";

class Socket {
  static OPEN = 1;
  static instances: Socket[] = [];
  readyState = 0;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((message: { data: string }) => void) | null = null;
  send = vi.fn();
  close = vi.fn(() => { this.readyState = 3; this.onclose?.(); });
  constructor() { Socket.instances.push(this); }
  event(value: object) { this.onmessage?.({ data: JSON.stringify(value) }); }
}
let host: HTMLDivElement;
let root: Root;
const speak = vi.fn();
const cancel = vi.fn();
function button(label: string) {
  const element = [...host.querySelectorAll("button")].find(b => b.textContent === label);
  if (!element) throw new Error(`Missing button ${label}`);
  return element;
}
beforeEach(async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("WebSocket", Socket);
  vi.stubGlobal("SpeechSynthesisUtterance", class { constructor(public text: string) {} });
  Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speak, cancel } });
  Element.prototype.scrollTo = vi.fn();
  Socket.instances = [];
  speak.mockClear(); cancel.mockClear();
  host = document.createElement("div"); document.body.append(host);
  root = createRoot(host);
  await act(async () => root.render(<App />));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals(); });
async function connect() {
  await act(async () => button("CONNECT LOCAL COACH").click());
  const socket = Socket.instances[0]; socket.readyState = 1;
  await act(async () => socket.event({ type: "ready", agent_configured: true, provider: "test", model: "test" }));
  return socket;
}
test("connect, stream, finish, and stop with current voice preference", async () => {
  const socket = await connect();
  await act(async () => (host.querySelector('input[type="checkbox"]') as HTMLInputElement).click());
  await act(async () => button("START THE EGG TEST").click());
  expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ type: "text-input", text: "Start the egg test" }));
  expect(button("START THE EGG TEST").disabled).toBe(true);
  await act(async () => socket.event({ type: "assistant-start" }));
  await act(async () => socket.event({ type: "text-delta", text: "Test response" }));
  expect(host.textContent).toContain("Test response");
  await act(async () => socket.event({ type: "assistant-complete", text: "Test response" }));
  expect(speak).toHaveBeenCalledTimes(1);
  expect(button("START THE EGG TEST").disabled).toBe(false);
  await act(async () => button("STOP RESPONSE").click());
  expect(cancel).toHaveBeenCalled();
  expect(socket.send).toHaveBeenLastCalledWith(JSON.stringify({ type: "interrupt-signal" }));
});
test("connecting cannot open duplicate sockets; malformed replies recover", async () => {
  await act(async () => button("CONNECT LOCAL COACH").click());
  expect(button("CONNECT LOCAL COACH").disabled).toBe(true);
  await act(async () => button("CONNECT LOCAL COACH").click());
  expect(Socket.instances).toHaveLength(1);
  await act(async () => Socket.instances[0].onmessage?.({ data: "{broken" }));
  expect(host.textContent).toContain("unreadable response");
});
test("provider errors clear an unfinished response and permit retry", async () => {
  const socket = await connect();
  await act(async () => button("START THE EGG TEST").click());
  await act(async () => socket.event({ type: "text-delta", text: "unfinished" }));
  await act(async () => socket.event({ type: "error", message: "Provider unavailable" }));
  expect(host.textContent).not.toContain("unfinished");
  expect(host.textContent).toContain("Provider unavailable");
  expect(button("START THE EGG TEST").disabled).toBe(false);
});
test("camera can be turned off and releases every media track", async () => {
  const stop = vi.fn();
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: {
    getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] })
  }});
  await act(async () => button("ENABLE CAMERA").click());
  await act(async () => button("TURN CAMERA OFF").click());
  expect(stop).toHaveBeenCalledTimes(1);
  expect(button("ENABLE CAMERA")).toBeTruthy();
});
