const handleDislike = async (matchId) => {
  try {
    const res = await fetch(`/api/dislike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id, targetId: matchId }),
    });

    if (!res.ok) throw new Error("Failed to dislike");

    // ✅ Remove match from local state
    setMatches((prev) => prev.filter((m) => m._id !== matchId));
  } catch (err) {
    console.error("Dislike failed:", err);
  }
};
