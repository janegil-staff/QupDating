"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";

function formatNorwegianDate(dateString) {
  const date = new Date(dateString);
  if (isToday(date)) return `i dag kl. ${format(date, "HH:mm", { locale: nb })}`;
  if (isYesterday(date)) return `i går kl. ${format(date, "HH:mm", { locale: nb })}`;
  return format(date, "d. MMMM 'kl.' HH:mm", { locale: nb });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const userId = session.user.id;

    const fetchDashboardData = async () => {
      const userRes = await fetch(`/api/users/${userId}`);
      const userData = await userRes.json();
      const matchUsers = userData.matches || [];

      setMatches(matchUsers);

      if (matchUsers.length > 0) {
        const matchUserId = matchUsers[0]._id;
        const generatedRoomId = [userId, matchUserId].sort().join("-");
        setRoomId(generatedRoomId);
        fetchMessages(generatedRoomId);
      }
    };

    fetchDashboardData();
  }, [status, session]);

  const fetchMessages = async (room = roomId) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?roomId=${room}${cursor ? `&cursor=${cursor}` : ""}`);
      const data = await res.json();
      setMessages((prev) => [...prev, ...data.messages]);
      setCursor(data.nextCursor || null);
      setHasMore(data.hasMore !== false);
    } catch (err) {
      console.error("Message fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          fetchMessages();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  if (status === "loading") return <p className="text-white">Laster inn...</p>;
  if (status === "unauthenticated") return <p className="text-white">Du må logge inn</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-6 py-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold">Hei {session.user.name} 👋</h1>
          <p className="text-gray-400 mt-2">Velkommen tilbake til Klip – finn kjærligheten i Bergen</p>
        </header>

        <section className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Dine matcher</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match._id} className="bg-gray-800 p-4 rounded-xl shadow hover:scale-[1.02] transition-transform">
                <img
                  src={match.images?.[0]?.url || "/default-avatar.jpg"}
                  alt={match.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-rose-500"
                />
                <h3 className="text-lg font-semibold text-center">{match.name}, {match.age}</h3>
                <p className="text-sm text-gray-400 text-center">{match.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Meldinger</h2>
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg._id} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{msg.senderName}</span>
                  <span className="text-sm text-gray-400">{formatNorwegianDate(msg.createdAt)}</span>
                </div>
                <p className="text-gray-200 mt-2">{msg.content}</p>
              </li>
            ))}
          </ul>
          <div ref={loaderRef} className="h-10 flex justify-center items-center mt-6">
            {loading && <span className="text-gray-400">Laster inn flere meldinger…</span>}
          </div>
        </section>
      </div>
    </main>
  );
}
