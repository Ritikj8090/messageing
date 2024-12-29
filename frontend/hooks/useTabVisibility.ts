import { useEffect, useState } from "react";

const useTabVisibility = () => {
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === "visible");
    };

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isTabActive;
};

export default useTabVisibility;
