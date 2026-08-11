import { useEffect, useState } from "react";

export function useFormViewport(heightThreshold: number = 750) {
  const [isHeightConstrained, setIsHeightConstrained] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsHeightConstrained(window.innerHeight < heightThreshold);
    }

    window.addEventListener("resize", handleResize);
    
    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [heightThreshold]);

  return isHeightConstrained;
}
