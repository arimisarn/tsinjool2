import React from 'react'
import { motion } from 'framer-motion';

const Bubbles = (
    {
        x,
        y,
        size,
        color,
    }: {
        x: number;
        y: number;
        size: number;
        color: string;
    }
) => {
  return (
    <motion.circle
    cx={x}
    cy={y}
    r={size}
    fill={color}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
        opacity: [0.7, 0.3, 0.7],
        scale: [1, 1.2, 1],
        x: x + Math.random() * 100 - 50,
        y: y + Math.random() * 100 - 50,
    }}
    transition={{
        duration: 5 + Math.random() * 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
    }}
/>
  )
}

export default Bubbles
