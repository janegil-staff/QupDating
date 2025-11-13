import { useState } from "react";

const emojiCategories = {
  Smileys: ['😀', '😄', '😎', '🥳', '😢', '😡', '🤔', '😴'],
  Love: ['😍', '❤️', '💋', '😘', '💘', '💞', '💕', '💖'],
  Reactions: ['👍', '👎', '👏', '🙌', '🔥', '😂', '🥺', '🤯'],
  Food: ['🍕', '🍔', '🍣', '🍩', '🍷', '☕️', '🍎', '🍫'],
  Nature: ['🌈', '🌲', '🌊', '🌞', '🌧️', '❄️', '🌸', '🌍'],
  Norsk: ['🇳🇴', '🧡', '🐟', '🏔️', '⛷️', '🛶', '🧊', '🦌']
};

export default function EmojiPicker({ onSelect, autoClose = false, onClose }) {
  const [activeCategory, setActiveCategory] = useState("Smileys");

  const handleSelect = (emoji) => {
    onSelect(emoji);
    if (autoClose && onClose) onClose();
  };

  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.keys(emojiCategories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-2 py-1 rounded text-sm ${
              activeCategory === category
                ? "bg-pink-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-2">
        {emojiCategories[activeCategory].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleSelect(emoji)}
            className="text-2xl hover:scale-110 transition"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
