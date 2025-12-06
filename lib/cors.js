// lib/cors.js
import { NextResponse } from "next/server";

const allowedOrigin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081" // Expo dev
    : "https://qup.dating";   // Production domain

export function withCORS(response) {
  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      ...response.headers,
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export function corsOptions() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
