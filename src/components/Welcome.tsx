import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/db';

interface WelcomeProps {
  userId: string;
  onClose: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ userId, onClose }) => {
  const [username, setUsername] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      const user = await db.users.get(userId);
      if (user) {
        setUsername(user.username);
      }
    };
    fetchUsername();

    // Auto-close welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [userId, onClose]);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-xl p-6 z-50 text-center"
        >
          <h2 className="text-2xl font-serif mb-2">Welcome back,</h2>
          <p className="text-3xl font-dancing-script text-red-500">{username}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Welcome;
