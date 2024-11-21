import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { db } from './lib/db';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import IntroAnimation from './components/IntroAnimation';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  FilePlus, 
  Settings2, 
  Save, 
  Sun, 
  Moon, 
  LogOut 
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  content: string;
  pageNumber: number;
  updatedAt: Date;
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFont, setSelectedFont] = useState('serif');
  const [textColor, setTextColor] = useState('#FF0000');
  
  // Page Management
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    const loadPages = async () => {
      if (userId) {
        try {
          const savedPages = await db.entries
            .where('userId')
            .equals(userId)
            .toArray();

          const sortedPages = savedPages
            .map(page => ({
              id: page.id,
              title: page.title || `Untitled Page ${page.pageNumber}`,
              content: page.content,
              pageNumber: page.pageNumber,
              updatedAt: new Date(page.updatedAt)
            }))
            .sort((a, b) => a.pageNumber - b.pageNumber);

          setPages(sortedPages);
          if (sortedPages.length === 0) {
            // Create first page if no pages exist
            handleNewPage();
          }
        } catch (error) {
          console.error('Error loading pages:', error);
        }
      }
    };

    loadPages();
  }, [userId]);

  const handleLogin = (uid: string) => {
    setIsAuthenticated(true);
    setUserId(uid);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId('');
    setPages([]);
    setCurrentPageIndex(0);
  };

  const handleNewPage = () => {
    const newPage: Page = {
      id: uuidv4(),
      title: `Untitled Page ${pages.length + 1}`,
      content: '',
      pageNumber: pages.length + 1,
      updatedAt: new Date()
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
    setShowDashboard(false);
  };

  const handleSave = async () => {
    try {
      const currentPage = pages[currentPageIndex];
      await db.entries.put({
        id: currentPage.id,
        userId,
        title: currentPage.title,
        content: currentPage.content,
        pageNumber: currentPage.pageNumber,
        updatedAt: new Date(),
        userIdAndPage: `${userId}-${currentPage.pageNumber}`
      });

      // Update the pages array with the new timestamp
      const updatedPages = [...pages];
      updatedPages[currentPageIndex] = {
        ...currentPage,
        updatedAt: new Date()
      };
      setPages(updatedPages);
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      title: newTitle
    };
    setPages(updatedPages);
    setIsEditingTitle(false);
  };

  const handleContentChange = (newContent: string) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      content: newContent
    };
    setPages(updatedPages);
  };

  const handlePageSelect = (pageIndex: number) => {
    setCurrentPageIndex(pageIndex);
    setShowDashboard(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
      
      {!showIntro && (
        !isAuthenticated ? (
          <Auth onLogin={handleLogin} />
        ) : showDashboard ? (
          <Dashboard
            userId={userId}
            darkMode={darkMode}
            pages={pages}
            onBack={() => setShowDashboard(false)}
            onPageSelect={handlePageSelect}
            onLogout={handleLogout}
          />
        ) : (
          <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-red-50'}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
              {/* Title Section */}
              <div className="mb-8">
                {isEditingTitle ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={pages[currentPageIndex]?.title || ''}
                      onChange={(e) => {
                        const newTitle = e.target.value.slice(0, 40); // Increased to 40 characters
                        handleTitleChange(newTitle);
                      }}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                      className={`text-2xl font-bold w-full bg-transparent border-b-2 pr-16 ${
                        darkMode ? 'text-red-500 border-red-900/20' : 'text-red-900 border-red-200'
                      } focus:outline-none`}
                      maxLength={40}
                      placeholder="Enter title (max 40 chars)"
                      autoFocus
                    />
                    <span className={`absolute right-0 top-1/2 -translate-y-1/2 text-sm ${
                      darkMode ? 'text-red-500/50' : 'text-red-900/50'
                    }`}>
                      {(pages[currentPageIndex]?.title || '').length}/40
                    </span>
                  </div>
                ) : (
                  <h1
                    onClick={() => setIsEditingTitle(true)}
                    className={`text-2xl font-bold cursor-pointer hover:opacity-80 ${
                      darkMode ? 'text-red-500' : 'text-red-900'
                    }`}
                  >
                    {pages[currentPageIndex]?.title || 'Untitled Page'}
                  </h1>
                )}
              </div>

              {/* Content Area */}
              <div className="relative w-full flex-grow">
                <textarea
                  value={pages[currentPageIndex]?.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className={`w-full min-h-[300px] md:h-[calc(100vh-20rem)] p-6 rounded-lg resize-none ${
                    darkMode ? 'bg-gray-900 text-red-400' : 'bg-white text-red-900'
                  } focus:outline-none font-${selectedFont}`}
                  style={{ color: textColor }}
                  placeholder="Start writing..."
                />
              </div>

              {/* Bottom Fixed Container */}
              <div className={`fixed bottom-0 left-0 right-0 z-50 ${
                darkMode ? 'bg-black/90' : 'bg-red-50/90'
              } backdrop-blur-md border-t ${
                darkMode ? 'border-red-900/20' : 'border-red-200'
              }`}>
                {/* Navigation Controls */}
                <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                  {/* Page Navigation */}
                  <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => currentPageIndex > 0 && handlePageSelect(currentPageIndex - 1)}
                      disabled={currentPageIndex === 0}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                        darkMode 
                          ? currentPageIndex === 0 ? 'bg-red-900/10 text-red-900/20' : 'hover:bg-red-900/20 text-red-500'
                          : currentPageIndex === 0 ? 'bg-red-200/50 text-red-900/20' : 'hover:bg-red-200 text-red-900'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className={`text-sm ${darkMode ? 'text-red-500' : 'text-red-900'}`}>
                      {currentPageIndex + 1} / {pages.length}
                    </span>
                    <button
                      onClick={() => currentPageIndex < pages.length - 1 && handlePageSelect(currentPageIndex + 1)}
                      disabled={currentPageIndex === pages.length - 1}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                        darkMode 
                          ? currentPageIndex === pages.length - 1 ? 'bg-red-900/10 text-red-900/20' : 'hover:bg-red-900/20 text-red-500'
                          : currentPageIndex === pages.length - 1 ? 'bg-red-200/50 text-red-900/20' : 'hover:bg-red-200 text-red-900'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Main Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowDashboard(true)}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                        darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
                      }`}
                      title="Dashboard"
                    >
                      <LayoutGrid className="w-5 h-5" />
                      <span className="sr-only">Dashboard</span>
                    </button>
                    <button
                      onClick={handleNewPage}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                        darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
                      }`}
                      title="New Page"
                    >
                      <FilePlus className="w-5 h-5" />
                      <span className="sr-only">New Page</span>
                    </button>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                        darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
                      }`}
                      title="Settings"
                    >
                      <Settings2 className="w-5 h-5" />
                      <span className="sr-only">Settings</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                        darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
                      }`}
                      title="Save"
                    >
                      <Save className="w-5 h-5" />
                      <span className="sr-only">Save</span>
                    </button>
                    <button
                      onClick={toggleDarkMode}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                        darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
                      }`}
                      title={darkMode ? 'Light Mode' : 'Dark Mode'}
                    >
                      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      <span className="sr-only">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                        darkMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-red-200 text-red-900'
                      }`}
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="sr-only">Logout</span>
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showSettings && (
                  <Settings
                    onClose={() => setShowSettings(false)}
                    selectedFont={selectedFont}
                    setSelectedFont={setSelectedFont}
                    textColor={textColor}
                    setTextColor={setTextColor}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default App;