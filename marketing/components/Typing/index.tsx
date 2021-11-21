import { FC, useEffect, useRef } from 'react';

import Typed from 'typed.js';

interface Props {
  words: string[];
}

const Typing: FC<Props> = ({ words }: Props) => {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const typed = new Typed(el.current, {
      strings: words,
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, [words]);

  return <span ref={el}></span>;
};

export default Typing;
