"use client";

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);
  const eventName = `bioevent-storage:${key}`;

  const getInitialSnapshot = useCallback(() => initialValueRef.current, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return initialValueRef.current;
    try {
      const stored = window.localStorage.getItem(key);
      const cached = snapshotCache.get(key);
      if (cached?.raw === stored) return cached.value as T;
      const nextValue = stored ? (JSON.parse(stored) as T) : initialValueRef.current;
      snapshotCache.set(key, { raw: stored, value: nextValue });
      return nextValue;
    } catch {
      return initialValueRef.current;
    }
  }, [key]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => undefined;
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) onStoreChange();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(eventName, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(eventName, onStoreChange);
      };
    },
    [eventName, key],
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, getInitialSnapshot);

  const setValue = useCallback(
    (nextValue: T) => {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, JSON.stringify(nextValue));
      snapshotCache.delete(key);
      window.dispatchEvent(new Event(eventName));
    },
    [eventName, key],
  );

  return useMemo(() => [value, setValue] as const, [setValue, value]);
}
