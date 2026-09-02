import { useState, useEffect } from 'react';

export function usePersistentForm<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.warn('Error reading localStorage', error);
    }
    setIsLoaded(true);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setState((prevState) => {
        const valueToStore = value instanceof Function ? value(prevState) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  };

  const clear = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setState(initialValue);
    } catch (error) {
      console.warn('Error clearing localStorage', error);
    }
  };

  return [state, setValue, isLoaded, clear] as const;
}
