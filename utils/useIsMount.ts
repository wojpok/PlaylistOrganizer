import { useRef, useEffect } from 'react';

// hook zwracający true tylko i wyłącznie przy pierwszym renderze komponentu
export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};