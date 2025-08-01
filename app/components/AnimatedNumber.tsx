'use client'

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 800 }) => {
  const [displayedValue, setDisplayedValue] = useState(value);
  const startValue = useRef(value);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(animationFrame.current!);
    startValue.current = displayedValue;
    startTime.current = null;

    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const interpolatedValue =
        startValue.current + (value - startValue.current) * progress;
      setDisplayedValue(interpolatedValue);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(step);
      }
    };

    animationFrame.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame.current!);
  }, [value, duration]);

  return (
    <div className="text-sm font-bold text-right tabular-nums text-gray-400">
      {displayedValue.toLocaleString('en-US')}
    </div>
  );
};

export default AnimatedNumber;