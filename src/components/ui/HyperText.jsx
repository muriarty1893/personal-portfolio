import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import './hyper-text.css';

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const getRandomInt = (max) => Math.floor(Math.random() * max);

const defaultFramerProps = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 3 },
};

export function HyperText({
  text,
  duration = 800,
  framerProps = defaultFramerProps,
  className = '',
  animateOnLoad = true,
  as = 'span',
  boxedCharacters = '',
}) {
  const [displayText, setDisplayText] = useState(() => text.split(''));
  const [animationKey, setAnimationKey] = useState(animateOnLoad ? 1 : 0);
  const isFirstRender = useRef(true);
  const TextTag = as;

  const triggerAnimation = () => {
    setDisplayText(
      text.split('').map((letter) => (
        letter === ' ' ? letter : alphabets[getRandomInt(alphabets.length)]
      )),
    );
    setAnimationKey((key) => key + 1);
  };

  useEffect(() => {
    if (!animateOnLoad && isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayText(text.split(''));
      return undefined;
    }

    isFirstRender.current = false;
    let iterations = 0;
    const interval = setInterval(() => {
      if (iterations < text.length) {
        setDisplayText((current) =>
          current.map((letter, index) =>
            letter === ' '
              ? letter
              : index <= iterations
                ? text[index]
                : alphabets[getRandomInt(alphabets.length)],
          ),
        );
        iterations += 0.1;
        return;
      }

      setDisplayText(text.split(''));
      clearInterval(interval);
    }, Math.max(16, duration / Math.max(text.length * 10, 1)));

    return () => clearInterval(interval);
  }, [animateOnLoad, animationKey, duration, text]);

  return (
    <TextTag
      className={`hyper-text ${className}`.trim()}
      onMouseEnter={triggerAnimation}
      aria-label={text}
    >
      <AnimatePresence mode="wait">
        {displayText.map((letter, index) => (
          <motion.span
            key={index}
            className={[
              'hyper-text__letter',
              letter === ' ' ? 'hyper-text__letter--space' : '',
              boxedCharacters.includes(text[index]) ? 'hyper-text__letter--boxed' : '',
            ].filter(Boolean).join(' ')}
            {...framerProps}
            aria-hidden="true"
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </TextTag>
  );
}
