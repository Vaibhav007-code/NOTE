import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Key, Mail, UserPlus, LogIn } from 'lucide-react';
import { db } from '../lib/db';

interface LoginPageProps {
  onLogin: (userId: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Registration validation
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Check if username exists
        const existingUser = await db.users.where('username').equals(username).first();
        if (existingUser) {
          setError('Username already exists');
          return;
        }

        // Create new user
        const userId = await db.users.add({
          username,
          email,
          password, // In a real app, hash this password
          name: username,
          createdAt: new Date()
        });

        onLogin(userId.toString());
      } else {
        // Login
        const user = await db.users.where('username').equals(username).first();
        if (user && user.password === password) { // In a real app, compare hashed passwords
          onLogin(user.id!.toString());
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="w-full max-w-md px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isRegistering ? 'Create Your Diary' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isRegistering
                ? 'Start your journaling journey'
                : 'Continue your journaling journey'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-500 dark:bg-amber-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors"
            >
              {isRegistering ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              {isRegistering
                ? 'Already have an account? Sign in'
                : 'Need an account? Create one'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
