'use client';
import React, { useRef, useState } from 'react';
import { Cursor } from '@/components/core/cursor';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';

export function ItemCardWithCursor({ children, onClick, className = '' }) {
  const [isHovering, setIsHovering] = useState(false);
  const targetRef = useRef(null);

  const handlePositionChange = (x, y) => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const isInside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      setIsHovering(isInside);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Cursor
        attachToParent
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{
          bounce: 0.001,
        }}
        transition={{
          ease: 'easeInOut',
          duration: 0.15,
        }}
        onPositionChange={handlePositionChange}
      >
        <motion.div
          animate={{
            width: isHovering ? 80 : 16,
            height: isHovering ? 32 : 16,
          }}
          className="flex items-center justify-center rounded-[24px] bg-emerald-400 text-slate-950 shadow-xl backdrop-blur-md"
        >
          <AnimatePresence>
            {isHovering ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="inline-flex w-full items-center justify-center"
              >
                <div className="inline-flex items-center text-xs font-bold text-slate-950">
                  More <PlusIcon className="ml-1 h-3.5 w-3.5" />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </Cursor>
      <div ref={targetRef} onClick={onClick} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}

export default ItemCardWithCursor;
