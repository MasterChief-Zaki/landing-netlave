"use client";

import { useEffect, useRef } from "react";
import type { SceneVariant } from "./createNetLaveScene";

interface NetLaveSceneProps {
  variant: SceneVariant;
  speed?: number;
  className?: string;
}

// Runs `callback` once the browser is idle, and returns a function that cancels it.
function scheduleWhenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const idleHandle = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(idleHandle);
  }
  const timeoutHandle = window.setTimeout(callback, 200);
  return () => window.clearTimeout(timeoutHandle);
}

// three.js is lazy loaded so it never blocks the page: the scene module is
// imported only after hydration, once this element is near the viewport and
// the browser is idle. Until then, and if WebGL is unavailable, it stays empty.
export function NetLaveScene({
  variant,
  speed = 1,
  className,
}: NetLaveSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isCancelled = false;
    let disposeScene: (() => void) | undefined;
    let cancelIdleWait: (() => void) | undefined;

    const loadScene = async () => {
      try {
        const { createNetLaveScene } = await import("./createNetLaveScene");
        if (!isCancelled) {
          disposeScene = createNetLaveScene(container, { variant, speed });
        }
      } catch (error) {
        console.error("NetLaveScene: three.js failed to load", error);
      }
    };

    const nearViewportObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        nearViewportObserver.disconnect();
        cancelIdleWait = scheduleWhenIdle(() => void loadScene());
      },
      { rootMargin: "200px" },
    );
    nearViewportObserver.observe(container);

    return () => {
      isCancelled = true;
      nearViewportObserver.disconnect();
      cancelIdleWait?.();
      disposeScene?.();
    };
  }, [variant, speed]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
