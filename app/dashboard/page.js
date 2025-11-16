"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";
import { io } from "socket.io-client";
import MatchTabs from "@/components/MatchTabs";

function formatNorwegianDate(dateString) {
  const date = new Date(dateString);
  if (isToday(date))
    return `i dag kl. ${format(date, "HH:mm", { locale: nb })}`;
  if (isYesterday(date))
    return `i går kl. ${format(date, "HH:mm", { locale: nb })}`;
  return format(date, "d. MMMM 'kl.' HH:mm", { locale: nb });
}

const socket = io({ path: "/api/socket" });

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [matches, setMatches] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const userId = session.user.id;

    const fetchDashboardData = async () => {
      const userRes = await fetch(`/api/users/${userId}`);
      const userData = await userRes.json();
      const matchUsers = userData.matches || [];

      setMatches(matchUsers);
      if (matchUsers.length > 0) {
        setActiveMatchId(matchUsers[0]._id);
      }
    };

    fetchDashboardData();
  }, [status, session]);

  useEffect(() => {
    if (!session?.user?.id || !activeMatchId) return;
    const generatedRoomId = [session.user.id, activeMatchId].sort().join("-");
    setRoomId(generatedRoomId);
    setMessages([]);
    setCursor(null);
    setHasMore(true);
    fetchMessages(generatedRoomId);
  }, [activeMatchId]);

  const fetchMessages = async (room = roomId) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages?roomId=${room}${cursor ? `&cursor=${cursor}` : ""}`
      );
      const data = await res.json();
      console.log("DATA", data);
      if (data.error) {
        setHasMore(false);
      }

      if (Array.isArray(data.messages)) {
        const reversed = [...data.messages].reverse();
        setMessages((prev) => {
          const all = [...reversed, ...prev];
          const unique = Array.from(
            new Map(all.map((m) => [m._id, m])).values()
          );
          return unique;
        });

        const latest = data.messages[data.messages.length - 1];
        if (latest) {
          setLastMessages((prev) => ({
            ...prev,
            [latest.roomId]: latest,
          }));
        }

        setCursor(data.nextCursor || null);
        setHasMore(data.hasMore !== false);
      }
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

  // Socket listener for real-time updates
  useEffect(() => {
    if (status !== "authenticated") return;

    socket.connect();
    socket.on("connect", () => {
      console.log("🔌 Dashboard socket connected:", socket.id);
    });

    socket.on("message", (msg) => {
      setLastMessages((prev) => ({
        ...prev,
        [msg.roomId]: msg,
      }));

      if (msg.roomId === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        // Scroll to bottom after DOM updates
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 100);
      }
    });

    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [status, roomId]);

  if (status === "loading") return <p className="text-white">Laster inn...</p>;
  if (status === "unauthenticated")
    return <p className="text-white">Du må logge inn</p>;

  const uniqueMessages = Array.from(
    new Map(messages.map((m) => [m._id, m])).values()
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-6 py-10">
      <div className="max-w-screen-xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold">Hei {session.user.name} 👋</h1>
          <p className="text-gray-400 mt-2">
            Velkommen tilbake til Qup – finn kjærligheten i Bergen
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-900 p-4 rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Dine matcher</h2>
            <MatchTabs
              matches={matches}
              activeMatchId={activeMatchId}
              onSelect={(id) => setActiveMatchId(id)}
              lastMessages={lastMessages}
              sessionUserId={session.user.id}
            />
          </div>

          <div className="md:col-span-2 bg-gray-900 p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Meldinger</h2>
            <div
              ref={scrollRef}
              className="flex flex-col max-h-[400px] overflow-y-auto space-y-4"
            >
              {uniqueMessages.reverse().map((msg) => (
                <div
                  key={msg._id}
                  className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          msg.sender.profileImage || "/images/placeholder.png"
                        }
                        alt={msg.sender.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p
                          className={`font-medium ${
                            msg.sender._id === session.user.id
                              ? "text-blue-400"
                              : "text-pink-500"
                          }`}
                        >
                          {msg.sender.name}
                        </p>
                        <p className="text-gray-200">{msg.content}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatNorwegianDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              <div
                ref={loaderRef}
                className="h-10 flex justify-center items-center mt-6"
              >
                {loading && hasMore && (
                  <p className="text-gray-400">Laster inn flere profiler…</p>
                )}

                {!hasMore && (
                  <p className="text-gray-500">Ingen flere meldinger å vise</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
