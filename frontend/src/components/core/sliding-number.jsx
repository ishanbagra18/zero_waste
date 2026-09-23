'use client';
import React from 'react';
import { motion } from 'framer-motion';

function Digit({ digit }) {
  const num = parseInt(digit, 10);
  if (isNaN(num)) {
    return <span className="inline-block">{digit}</span>;
  }

  return (
    <div className="relative inline-block overflow-hidden h-[1em] leading-none select-none">
      <motion.div
        animate={{ y: `-${num * 10}%` }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1em] flex items-center justify-center">
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function SlidingNumber({ value, padStart = false, className = '' }) {
  let str = String(value ?? 0);
  if (padStart && str.length === 1) {
    str = '0' + str;
  }

  return (
    <div className={`inline-flex items-center font-mono ${className}`}>
      {str.split('').map((char, i) => (
        <Digit key={i} digit={char} />
      ))}
    </div>
  );
}

export default SlidingNumber;
