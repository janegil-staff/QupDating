import { useEffect, useState } from "react";

export function useLikeStatus(profileId) {
  const [isLiked, setIsLiked] = useState(null);
  const [isMutual, setIsMutual] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch(`/api/is-liked?target=${profileId}`);
      const data = await res.json();
      setIsLiked(data.isLiked);
      setIsMutual(data.isMutual);
    };

    if (profileId) fetchStatus();
  }, [profileId]);

  return { isLiked, isMutual, refresh: () => fetchStatus() };
}
