import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  active: boolean;
  onDone: () => void;
};

export function Typewriter({ text, speed = 18, active, onDone }: Props) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setCount(0);
    doneRef.current = false;
  }, [text]);

  useEffect(() => {
    if (!active) {
      setCount(text.length);
      if (!doneRef.current) {
        doneRef.current = true;
        onDoneRef.current();
      }
      return;
    }

    if (count >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDoneRef.current();
      }
      return;
    }

    const id = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(id);
  }, [active, count, speed, text.length]);

  return <span>{text.slice(0, count)}</span>;
}
