import { useEffect, useState } from "react";

export function useFormViewport(heightThreshold: number = 750) {
  const [isHeightConstrained, setIsHeightConstrained] = useState(false);

  useEffect(() => {
    function handleResize() {
      const ratio = window.innerWidth / window.innerHeight;
      // Constrain (move buttons to top) if it's a landscape screen (ratio > 1.2)
      // and vertical height is somewhat limited (< 950px), common for laptops.
      setIsHeightConstrained(ratio > 1.2 && window.innerHeight < 950);
    }

    window.addEventListener("resize", handleResize);
    
    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [heightThreshold]);

  return isHeightConstrained;
}
