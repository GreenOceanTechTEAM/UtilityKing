"use client";

import { useState, useEffect, useMemo } from 'react';

export function useScrollSpy(
  ids: string[],
  options: IntersectionObserverInit
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  const observer = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      options
    );
  }, [options]);

  useEffect(() => {
    if (!observer) return;

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [ids, observer]);

  return activeId;
}
