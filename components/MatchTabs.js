import { format, isToday, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";

function formatPreviewDate(dateString) {
  const date = new Date(dateString);
  if (isToday(date)) return format(date, "HH:mm", { locale: nb });
  if (isYesterday(date)) return "i går";
  return format(date, "d. MMM", { locale: nb });
}

export default function MatchTabs({ matches, activeMatchId, onSelect, lastMessages }) {
  return (
    <div className="flex overflow-x-auto gap-4 py-2 px-1 md:flex-col md:overflow-y-auto max-h-[300px] overflow-y-auto">
      {matches.map((match) => {
        const lastMsg = lastMessages?.[match._id];
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
            <img
              src={match.images?.[0]?.url || "/images/placeholder.png"}
              alt={match.name}
              className="w-10 h-10 rounded-full object-cover border border-white"
            />
            <div className="text-left w-full">
              <p className="font-semibold">
                {match.name}, {match.age}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {lastMsg?.content || "Ingen meldinger ennå"}
              </p>
              {lastMsg?.createdAt && (
                <p className="text-[10px] text-gray-500">
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
