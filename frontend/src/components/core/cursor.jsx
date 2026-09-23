'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export function Cursor({
  children,
  attachToParent = false,
  variants,
  springConfig = { bounce: 0.001 },
  transition = { ease: 'easeInOut', duration: 0.15 },
  onPositionChange,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef(null);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { stiffness: 400, damping: 28, ...springConfig });
  const y = useSpring(rawY, { stiffness: 400, damping: 28, ...springConfig });

  useEffect(() => {
    const handleMouseMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (onPositionChange) {
        onPositionChange(e.clientX, e.clientY);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    if (attachToParent && cursorRef.current?.parentElement) {
      const parent = cursorRef.current.parentElement;
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      };
    } else {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('mouseleave', handleMouseLeave);
      setIsVisible(true);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [attachToParent, rawX, rawY, onPositionChange]);

  return (
    <div ref={cursorRef} className="pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={variants?.initial || { scale: 0.3, opacity: 0 }}
            animate={variants?.animate || { scale: 1, opacity: 1 }}
            exit={variants?.exit || { scale: 0.3, opacity: 0 }}
            transition={transition}
            style={{
              position: 'fixed',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            className={className}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cursor;
