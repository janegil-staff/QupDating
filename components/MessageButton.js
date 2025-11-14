function MessageButton({ profileId }) {
  return (
    <a
      href={`/chat/${profileId}`}
      className="px-4 py-2 rounded-full font-semibold bg-green-600 hover:bg-green-700 text-white transition"
    >
      💬 Send melding
    </a>
  );
}
