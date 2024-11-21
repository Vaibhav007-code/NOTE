import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.h1
          className="text-8xl font-bold text-white mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          DABRIA
        </motion.h1>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          <motion.p className="text-xl text-white/80 font-light">
            created by
          </motion.p>
          <motion.h2 className="text-4xl font-semibold text-white">
            VAIBHAV
          </motion.h2>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
};

export default SplashScreen;
