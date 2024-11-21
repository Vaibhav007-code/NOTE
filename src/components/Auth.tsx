import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { db } from '../lib/db';

interface AuthProps {
  onLogin: (userId: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Login logic
        const user = await db.users
          .where('username')
          .equals(username)
          .first();
        
        console.log('Login attempt for user:', username);
        
        if (!user) {
          setError('User not found');
          return;
        }

        if (user.hashed_password === password) {
          console.log('Login successful');
          onLogin(user.id);
        } else {
          console.log('Invalid password');
          setError('Invalid password');
        }
      } else {
        // Registration logic
        if (username.length < 3) {
          setError('Username must be at least 3 characters long');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Check for existing user
        const existingUser = await db.users
          .where('username')
          .equals(username)
          .first();
        
        if (existingUser) {
          setError('Username already exists');
          return;
        }

        // Create new user
        const newUser = {
          id: crypto.randomUUID(),
          username: username,
          hashed_password: password
        };

        try {
          await db.users.add(newUser);
          console.log('Registration successful');
          onLogin(newUser.id);
        } catch (dbError) {
          console.error('Database error:', dbError);
          setError('Failed to create account. Please try again.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An error occurred. Please check your connection and try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-black"
    >
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-red-600">
            {isLogin ? 'Welcome Back' : 'Join Dabria'}
          </h2>
          <p className="text-red-400/60 mt-2">
            {isLogin 
              ? 'Enter your dark sanctuary' 
              : 'Create your personal space for dark thoughts'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-900/40 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-red-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg focus:outline-none focus:border-red-600 text-red-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg focus:outline-none focus:border-red-600 text-red-100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-900/80 hover:bg-red-900 text-red-100 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center mt-6 text-red-400/60 hover:text-red-400 transition-colors"
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </motion.div>
  );
};

export default Auth;