"use client";

import  Bubbles  from "./Bubbles";
import { useState, useEffect } from 'react';


const FloattingBubles = () => {
    const [bubbles, setBubbles] = useState<
		Array<{ id: number; x: number; y: number; size: number; color: string }>
	>([]);

	useEffect(() => {
		const newBubbles = Array.from({ length: 50 }, (_, i) => ({
			id: i,
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			size: Math.random() * 20 + 5,
			color: `rgba(${Math.random() * 255},${Math.random() * 255},${
				Math.random() * 255
			},0.3)`,
		}));
		setBubbles(newBubbles);
	}, []);

  return (
    <div className='absolute inset-0 pointer-events-none'>
			<svg className='w-full h-full'>
				<title>Floating Bubbles</title>
				{bubbles.map((bubble) => (
					<Bubbles key={bubble.id} {...bubble} />
				))}
			</svg>
		</div>
  )
}

export default FloattingBubles
