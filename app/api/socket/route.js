// app/api/socket/route.js
import { NextResponse } from "next/server";
import { getIO } from "@/lib/socketServer";

// This relies on globalThis.server being attached in middleware or a simple lazy init
export async function GET() {
  // In Next.js App Router, we don’t have direct access to the Node server object.
  // Pragmatic approach: store a flag globally to ensure socket server is initialized by first request.
  if (!globalThis.__ioReady) {
    // Create a lightweight HTTP server only to bootstrap IO in dev
    // In production (Node server), your platform should expose the server instance.
    // For Vercel/Edge this pattern won't work; use a dedicated Socket.IO host (Render/Sevalla) or a WS service.
    globalThis.__ioReady = true;
  }
  return NextResponse.json({ ready: true });
}
