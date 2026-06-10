"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  // Motion values for X and Y coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for cursor follow effect
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports standard cursor pointers (mouse devices)
    const pointerQuery = window.matchMedia("(pointer: fine)");
    setHasPointer(pointerQuery.matches);
    
    if (!pointerQuery.matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    // Add listeners for hover states on buttons, links, inputs
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .clickable'
      );
      
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    // Trigger initial attach
    addHoverListeners();

    // Create an observer to watch for DOM mutations (new links/buttons rendered dynamically)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  if (!hasPointer || !isVisible) return null;

  return (
    <>
      {/* Outer Follower Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-accent rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference no-print"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      {/* Inner Solid Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-highlight rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference no-print"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovered ? 0.5 : 1,
        }}
      />
    </>
  );
}
