import { getAgeFromDate } from "@/lib/getAgeFromDate";
import { format, isToday, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";

// Format preview date nicely in Norwegian
function formatPreviewDate(dateString) {
  const date = new Date(dateString);
  if (isToday(date)) return format(date, "HH:mm", { locale: nb });
  if (isYesterday(date)) return "i går";
  return format(date, "d. MMM", { locale: nb });
}

// Helper: get last message for a match
function getLastMessageForMatch(matchId, sessionUserId, lastMessages) {
  if (!matchId || !sessionUserId || !lastMessages) return null;
  const roomId = [sessionUserId, matchId].sort().join("-");
  return lastMessages[roomId] || null;
}

export default function MatchTabs({
  matches,
  activeMatchId,
  onSelect,
  lastMessages,
  sessionUserId,
}) {
  return (
    <div className="flex overflow-x-auto gap-4 py-2 px-1 md:flex-col md:overflow-y-auto max-h-[300px] overflow-y-auto">
      {matches.map((match) => {
        const lastMsg = getLastMessageForMatch(match._id, sessionUserId, lastMessages);
        console.log(match);
        return (
          <button
            key={match._id}
            onClick={() => onSelect(match._id)}
            className={`flex flex-col md:flex-row items-center gap-3 p-3 rounded-lg transition-all w-full ${
              activeMatchId === match._id
                ? "bg-pink-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {/* Avatar */}
            <img
              src={match.profileImage || "/images/placeholder.png"}
              alt={match.name}
              className="w-10 h-10 rounded-full object-cover border border-white"
            />

            {/* Text content */}
            <div className="text-left w-full">
              <p className="font-semibold">
                {match.name}, {getAgeFromDate(match.birthdate)}
              </p>

              {/* Last message preview */}
              <p
                className={`text-xs truncate ${
                  activeMatchId === match._id ? "text-pink-100" : "text-gray-400"
                }`}
              >
                {lastMsg?.content || "Ingen meldinger ennå"}
              </p>

              {/* Date */}
              {lastMsg?.createdAt && (
                <p
                  className={`text-[10px] ${
                    activeMatchId === match._id ? "text-pink-200" : "text-gray-500"
                  }`}
                >
                  {formatPreviewDate(lastMsg.createdAt)}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
