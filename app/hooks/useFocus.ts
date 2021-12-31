import { useRef } from "react";

const useFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setFocus = (): void => {
    inputRef.current && inputRef.current.focus();
  };

  return { inputRef, setFocus };
};

export default useFocus;
