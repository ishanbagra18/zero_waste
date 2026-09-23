'use client';
import React from 'react';
import { motion } from 'framer-motion';

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const presetVariants = {
  fade: {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  },
  slide: {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(6px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.35 } },
  },
};

export function TextEffect({
  children,
  per = 'char',
  preset = 'fade',
  variants,
  className = '',
  segmentClassName = '',
  as: Component = 'div',
  delay = 0,
}) {
  if (!children) return null;

  if (typeof children !== 'string') {
    return <Component className={className}>{children}</Component>;
  }

  const selectedSegmentVariant = variants?.item || presetVariants[preset] || presetVariants.fade;
  const containerVariants = {
    hidden: variants?.container?.hidden || defaultContainerVariants.hidden,
    visible: {
      ...defaultContainerVariants.visible,
      ...(variants?.container?.visible || {}),
      transition: {
        staggerChildren: per === 'char' ? 0.015 : 0.06,
        delayChildren: delay,
        ...(variants?.container?.visible?.transition || {}),
      },
    },
  };

  let segments = [];
  if (per === 'char') {
    segments = children.split('');
  } else if (per === 'word') {
    segments = children.split(' ');
  } else {
    segments = children.split('\n');
  }

  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`inline-block ${className}`}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={index}
          variants={selectedSegmentVariant}
          className={`inline-block ${segment === ' ' ? 'whitespace-pre' : ''} ${segmentClassName}`}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {per === 'word' && index < segments.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </MotionComponent>
  );
}

export default TextEffect;
