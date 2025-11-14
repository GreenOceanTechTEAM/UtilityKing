"use client";

import { motion } from 'framer-motion';

const ringVariants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: (i: number) => ({
    pathLength: 1,
    opacity: [0, 0.7, 0],
    transition: {
      pathLength: { delay: i * 0.4, duration: 1.5, ease: 'easeInOut' },
      opacity: { delay: i * 0.4, duration: 1.5, ease: 'linear' },
      repeat: Infinity,
      repeatDelay: 2,
    },
  }),
};

const analysisLines = [
    "> Connecting to tariff database...",
    "> Fetching supplier data...",
    "> Running optimization model...",
    "> Evaluating 34,512 possible combinations..."
]

const lineVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i:number) => ({
        opacity: [0, 1, 0.8, 1], // flicker effect
        x: 0,
        transition: {
            delay: i * 0.8,
            duration: 0.5,
            opacity: { duration: 0.2, times: [0, 0.5, 0.8, 1] }
        }
    })
}

export default function TerminalCore() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 font-code text-cyan-400/80">
      <motion.div
        className="relative h-24 w-24"
        initial="initial"
        animate="animate"
      >
        {[...Array(4)].map((_, i) => (
          <motion.svg
            key={i}
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            fill="none"
          >
            <motion.circle
              cx="50"
              cy="50"
              r={15 + i * 8}
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              strokeOpacity="0.8"
              variants={ringVariants}
              custom={i}
            />
          </motion.svg>
        ))}
         <motion.div 
            className="absolute inset-0 flex items-center justify-center text-accent"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div className="h-6 w-6 rounded-full bg-accent/50" />
        </motion.div>
      </motion.div>
      <div className="w-full max-w-sm">
        {analysisLines.map((line, i) => (
            <motion.p 
                key={line} 
                className="text-xs text-left"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={lineVariants}
            >
                {line}
            </motion.p>
        ))}
      </div>
    </div>
  );
}
