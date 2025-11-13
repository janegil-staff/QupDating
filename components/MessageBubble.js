export default function MessageBubble({ message, onReact }) {
  return (
    <div className="relative group">
      <div className="bg-gray-800 text-white p-3 rounded-lg max-w-xs">
        {message.text}
      </div>

      <div className="absolute -top-6 left-0 hidden group-hover:flex gap-1">
        {['🔥', '😍', '😂', '🥺', '👍'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReact(message.id, emoji)}
            className="text-xl hover:scale-125 transition"
          >
            {emoji}
          </button>
        ))}
      </div>

      {message.reactions?.length > 0 && (
        <div className="mt-1 flex gap-1">
          {message.reactions.map((r, i) => (
            <span key={i} className="text-lg animate-bounce">{r}</span>
          ))}
        </div>
      )}
    </div>
  );
}
