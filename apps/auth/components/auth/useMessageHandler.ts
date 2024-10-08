import { useEffect, useRef } from "react";

export const useMessageHandler = (
  error: string,
  success: string,
  setError: (msg: string) => void,
  setSuccess: (msg: string) => void,
  id: string,
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      setSuccess("");
    } else if (success) {
      setError("");
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (error || success) {
      timerRef.current = setTimeout(() => {
        setError("");
        setSuccess("");
        timerRef.current = null;
      }, 2500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [error, success, setError, setSuccess, id]);
};
