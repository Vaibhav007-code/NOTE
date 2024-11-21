import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onAnimationComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onAnimationComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 4000); // Total animation duration

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        {/* Book */}
        <motion.div
          className="w-[300px] h-[400px] relative"
          initial={{ rotateY: 0, scale: 0.9 }}
          animate={{
            rotateY: [-20, 0, -180],
            scale: [0.9, 1, 1],
            transition: {
              duration: 2,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* Front Cover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-800 rounded-lg shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-t-2 border-l-2 border-red-300/30 absolute top-8 left-8" />
              <div className="w-16 h-16 border-b-2 border-r-2 border-red-300/30 absolute bottom-8 right-8" />
            </div>
          </motion.div>

          {/* Back Cover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-red-800 to-red-900 rounded-lg shadow-2xl"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <motion.h1
            className="text-6xl font-bold mb-4 text-red-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            DABRIA
          </motion.h1>
          <motion.p
            className="text-xl text-red-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            Created by Vaibhav
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntroAnimation;
