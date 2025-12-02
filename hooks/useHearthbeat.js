import { useEffect } from "react";

export function useHeartbeat(interval = 5 * 60 * 1000) { // default: 5 minutes
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch("/api/auth/heartbeat", { method: "POST" });
      } catch (err) {
        console.error("❌ Heartbeat failed:", err);
      }
    };

    // send immediately on mount
    sendHeartbeat();

    // repeat every interval
    const id = setInterval(sendHeartbeat, interval);
    return () => clearInterval(id);
  }, [interval]);
}
