import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-6 px-4 border-b border-red-900/20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Dabria
          </h1>
        </div>
        <p className="text-sm opacity-75 italic">Where dark thoughts find their home</p>
      </div>
    </header>
  );
};

export default Header;