import { useState, useEffect } from "react";

// Custom hook for debouncing a value
export function useDebounce<T>(value: T, delay: number=300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout when value or delay changes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}


