// utils/getLastMessageForMatch.js
export function getLastMessageForMatch(matchId, sessionUserId, lastMessages) {
  if (!matchId || !sessionUserId || !lastMessages) return null;

  // Build the roomId key the same way your chat does
  const roomId = [sessionUserId, matchId].sort().join("_");

  return lastMessages[roomId] || null;
}
