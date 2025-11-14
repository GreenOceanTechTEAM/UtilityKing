"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const svgVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const baseLineVariants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const spikeVariants = {
  hidden: { pathLength: 0, y: 10 },
  visible: {
    pathLength: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.17, 0.67, 0.45, 1.35], // Gentle overshoot
    },
  },
};

const glowVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 0.35, 0],
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      delay: 1.2,
    },
  },
};

const textContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.04,
            delayChildren: 1.5,
        },
    },
};

const textLetterVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.25,
            ease: 'easeOut',
        },
    },
};

const dotVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: [1, 1.2, 1], // Micro-pop bounce
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    }
}

interface AnimatedLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AnimatedLogo({ className, width = 180, height = 40 }: AnimatedLogoProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const text = "UtilityKing";

  return (
    <motion.svg
      ref={ref}
      className={cn(className)}
      width={width}
      height={height}
      viewBox="0 0 180 40"
      variants={svgVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-label="Utility King AI Logo"
    >
      {/* Glow Effect */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <motion.g
        style={{ filter: 'url(#glow)' }}
        initial={{ opacity: 0 }}
        animate={isInView ? {
            opacity: [0, 0.5, 0],
            transition: { duration: 1.5, delay: 1.2, ease: "easeInOut" }
        } : {}}
      >
        <motion.g
           animate={isInView ? {
            opacity: [0, 0.15, 0],
            transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut", delay: 3 }
          } : {}}
        >
          <g stroke="#3ca3ff" strokeWidth="1.5">
            {/* Base Line */}
            <motion.path d="M 2 20 H 58" />
            {/* Spikes */}
            <motion.path d="M 12 20 V 10" />
            <motion.path d="M 30 20 V 2" />
            <motion.path d="M 48 20 V 10" />
          </g>
        </motion.g>
      </motion.g>

      {/* Main Crown Shape */}
      <g stroke="#3ca3ff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Base Line */}
        <motion.path
          d="M 2 20 H 58"
          variants={baseLineVariants}
        />
        {/* Spikes */}
        <motion.path
          d="M 12 20 V 10"
          variants={{
            ...spikeVariants,
            visible: { ...spikeVariants.visible, transition: { ...spikeVariants.visible.transition, delay: 0.6 } }
          }}
        />
        <motion.path
          d="M 30 20 V 2"
          variants={{
            ...spikeVariants,
            visible: { ...spikeVariants.visible, transition: { ...spikeVariants.visible.transition, delay: 0.65 } }
          }}
        />
        <motion.path
          d="M 48 20 V 10"
          variants={{
            ...spikeVariants,
            visible: { ...spikeVariants.visible, transition: { ...spikeVariants.visible.transition, delay: 0.7 } }
          }}
        />
      </g>

      {/* Brand Text */}
      <motion.text
        x="68"
        y="25"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="16"
        fontWeight="600"
        fill="hsl(var(--foreground))"
        letterSpacing="0.5"
        variants={textContainerVariants}
      >
        {text.split('').map((char, index) => (
          <motion.tspan key={index} variants={textLetterVariants}>
            {char}
          </motion.tspan>
        ))}
      </motion.text>
    </motion.svg>
  );
}
