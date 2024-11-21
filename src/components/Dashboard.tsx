import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, Trash2 } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  content: string;
  pageNumber: number;
  updatedAt: Date;
}

interface DashboardProps {
  userId: string;
  darkMode: boolean;
  pages: Page[];
  onBack: () => void;
  onPageSelect: (index: number) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  darkMode,
  pages,
  onBack,
  onPageSelect,
  onLogout
}) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-red-50'}`}>
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-10 py-4 px-4 md:px-8 border-b backdrop-blur-sm ${
        darkMode ? 'border-red-900/20 bg-black/80' : 'border-red-200 bg-red-50/80'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-xl md:text-2xl font-bold ${
              darkMode ? 'text-red-500' : 'text-red-900'
            }`}>
              My Journal Pages
            </h1>
          </div>
          <button
            onClick={onLogout}
            className={`p-2 md:px-4 md:py-2 rounded-lg transition-colors flex items-center gap-2 ${
              darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
            }`}
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-12">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <FileText className={`w-16 h-16 mb-4 ${darkMode ? 'text-red-500/50' : 'text-red-900/50'}`} />
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-red-500' : 'text-red-900'}`}>
              No Pages Yet
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
              Create your first journal page to get started
            </p>
            <button
              onClick={onBack}
              className={`px-6 py-3 rounded-lg transition-colors ${
                darkMode ? 'bg-red-900/20 hover:bg-red-900/30 text-red-500' 
                : 'bg-red-200 hover:bg-red-300 text-red-900'
              }`}
            >
              Start Writing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {pages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onPageSelect(index)}
                className={`p-4 md:p-6 rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-102 ${
                  darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-red-50'
                } shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold truncate ${
                      darkMode ? 'text-red-500' : 'text-red-900'
                    }`} title={page.title}>
                      {page.title}
                    </h3>
                    <div className={`flex items-center gap-2 text-sm ${
                      darkMode ? 'text-red-400/60' : 'text-red-700/60'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    #{page.pageNumber}
                  </span>
                </div>
                <p className={`text-sm line-clamp-3 ${
                  darkMode ? 'text-red-400' : 'text-red-700'
                }`}>
                  {page.content || 'No content'}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
