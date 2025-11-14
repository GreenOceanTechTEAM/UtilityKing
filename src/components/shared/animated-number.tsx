"use client";

import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation, useSpring, AnimatePresence } from 'framer-motion';

const sparkleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: [0, 1.2, 0],
    opacity: [0, 1, 0],
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: "circOut"
    }
  })
};

const Sparkles = () => {
  const sparkles = Array.from({ length: 8 });
  const positions = [
    { top: '-10%', left: '110%' }, { top: '20%', left: '-20%' },
    { top: '80%', left: '120%' }, { top: '100%', left: '50%' },
    { top: '0%', left: '0%' }, { top: '50%', left: '115%' },
    { top: '110%', left: '80%' }, { top: '30%', left: '110%' },
  ];
  return (
    <>
      {sparkles.map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={sparkleVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: 'absolute',
            ...positions[i % positions.length],
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--accent))',
            boxShadow: '0 0 8px hsl(var(--accent))'
          }}
        />
      ))}
    </>
  );
};


type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
};

export default function AnimatedNumber({ value, prefix = "", suffix = "" }: AnimatedNumberProps) {
  const [showSparkles, setShowSparkles] = useState(false);
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
        transition: { duration: 1.2, ease: "power1.out" },
      });
    }
  }, [inView, value, spring, controls]);
  
  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
        const element = document.getElementById(`animated-number-${value}`);
        if (element) {
            element.textContent = `${prefix}${latest.toLocaleString('en-US', { maximumFractionDigits: 0 })}${suffix}`;
        }
    });

    const onComplete = () => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 300);
    };

    if (spring.get() === value) {
      onComplete();
    } else {
      const unsubscribeComplete = spring.on("change", (latest) => {
        if (latest >= value) {
          onComplete();
          unsubscribeComplete();
        }
      });
      return () => unsubscribeComplete();
    }

    return () => {
        unsubscribe();
    }
  }, [spring, prefix, suffix, value]);


  return (
    <motion.span
      ref={ref}
      className="relative inline-block"
    >
        <motion.span 
          id={`animated-number-${value}`}
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        />
        <AnimatePresence>
            {showSparkles && <Sparkles />}
        </AnimatePresence>
    </motion.span>
  );
}
