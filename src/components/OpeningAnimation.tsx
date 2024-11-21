import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface OpeningAnimationProps {
  onAnimationComplete: () => void;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onAnimationComplete }) => {
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    // Show creator text after book animation
    const timer = setTimeout(() => {
      setShowCreator(true);
    }, 1500);

    // Complete animation after all elements are shown
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.5
          }}
          className="text-red-600"
        >
          <BookOpen className="w-32 h-32" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-6xl font-serif font-bold text-red-600 tracking-wider"
          >
            DABRIA
          </motion.h1>
          
          <AnimatePresence>
            {showCreator && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-red-400/80 text-lg italic"
              >
                Created by Vaibhav
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OpeningAnimation;
