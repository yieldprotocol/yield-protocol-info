import { useState } from 'react';

/* Simple Hook for caching & retrieved data */
export const useCachedState = (key: string, initialValue: any, account?: string) => {
  const genKey = account ? `${account}_${key}` : key;
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(genKey);
      /* Parse stored json or if none, return initialValue */
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue and handle error - needs work
      return initialValue;
    }
  });
  const setValue = (value: any) => {
    try {
      // For same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(genKey, JSON.stringify(valueToStore));
    } catch (error) {
      // TODO: handle the error cases needs work
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const clearAll = () => window.localStorage.clear();

  return [storedValue, setValue, clearAll] as const;
};
