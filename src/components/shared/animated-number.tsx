"use client";

import { useEffect } from "react";
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation, useSpring } from 'framer-motion';

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
};

export default function AnimatedNumber({ value, prefix = "", suffix = "" }: AnimatedNumberProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  useEffect(() => {
    if (inView) {
      spring.set(value);
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
    }
  }, [inView, value, spring, controls]);
  
  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
        const element = document.getElementById(`animated-number-${value}`);
        if (element) {
            element.textContent = `${prefix}${latest.toFixed(value % 1 !== 0 ? 1 : 0)}${suffix}`;
        }
    });
    return unsubscribe;
  }, [spring, prefix, suffix, value]);


  return (
    <motion.span
      ref={ref}
      id={`animated-number-${value}`}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
    />
  );
}
