import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    // Start the sequence after component mounts
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Initial delay
      setShowTitle(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for title
      setShowCreator(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before completing
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative">
        {/* Book Animation */}
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{
            duration: 1.5,
            type: "spring",
            stiffness: 100,
          }}
          className="relative w-64 h-80"
        >
          {/* Book Cover */}
          <motion.div
            className="absolute inset-0 bg-amber-200 dark:bg-gray-700 rounded-lg shadow-2xl"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              rotateY: [-180, 0, -30, 0],
              z: [0, 50, 30, 0],
            }}
            transition={{
              duration: 2,
              times: [0, 0.5, 0.8, 1],
              ease: "easeInOut",
            }}
          >
            {/* Book Spine Effect */}
            <div
              className="absolute left-0 top-0 bottom-0 w-8 bg-amber-300 dark:bg-gray-600"
              style={{
                transform: 'rotateY(-30deg) translateX(-16px)',
                transformOrigin: 'left',
              }}
            />

            {/* Book Cover Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Book className="w-24 h-24 text-amber-800 dark:text-amber-200" />
            </div>

            {/* Pages Effect */}
            <div
              className="absolute right-0 top-2 bottom-2 w-[calc(100%-8px)] bg-white dark:bg-gray-800 rounded-r-lg"
              style={{
                transform: 'translateZ(-2px)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Title Animation */}
        <AnimatePresence>
          {showTitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 text-center"
            >
              <motion.h1
                className="text-6xl font-serif font-bold text-amber-800 dark:text-amber-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  textShadow: "0 0 8px rgba(251, 191, 36, 0.3)",
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                DABRIA
              </motion.h1>

              {/* Creator Credit */}
              <AnimatePresence>
                {showCreator && (
                  <motion.p
                    className="mt-4 text-lg text-amber-600 dark:text-amber-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Created by Vaibhav
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntroAnimation;
