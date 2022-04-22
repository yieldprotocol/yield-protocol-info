import { useState, useEffect } from 'react';

const getStorageValue = (key: string, defaultValue: string, account?: string) => {
  const itemInLocalStorage: string | null = JSON.parse(localStorage.getItem(key)!);
  return itemInLocalStorage ?? defaultValue;
};

export const useLocalStorage = (key: string, defaultValue: string) => {
  const [value, setValue] = useState<string>(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
