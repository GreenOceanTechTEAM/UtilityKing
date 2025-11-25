
"use client";

import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * A custom React hook that detects whether the user has a preference for reduced motion.
 * It listens to the 'prefers-reduced-motion' media query.
 * @returns {boolean} - True if the user prefers reduced motion, false otherwise.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window.matchMedia is available
    if (typeof window.matchMedia === 'function') {
      const mediaQueryList = window.matchMedia(QUERY);
      
      // Set the initial state
      setPrefersReducedMotion(mediaQueryList.matches);

      // Define a listener for changes
      const listener = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };

      // Add the listener
      mediaQueryList.addEventListener('change', listener);

      // Clean up the listener on component unmount
      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    } else {
      // Default to false if matchMedia is not supported (e.g., in SSR)
      setPrefersReducedMotion(false);
    }
  }, []);

  return prefersReducedMotion;
};
