import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../lib/db';

interface JournalPageProps {
  pageNumber: number;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  font: string;
  textColor: string;
  darkMode: boolean;
  userId: string | null;
  currentFileId?: string;
}

const JournalPage: React.FC<JournalPageProps> = ({
  pageNumber,
  isActive,
  onNext,
  onPrev,
  font,
  textColor,
  darkMode,
  userId,
  currentFileId
}) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (currentFileId) {
      loadContent(currentFileId);
    }
  }, [currentFileId]);

  const loadContent = async (fileId: string) => {
    try {
      const entry = await db.entries.get(fileId);
      if (entry) {
        setContent(entry.content);
        setLastSaved(new Date(entry.createdAt));
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const saveContent = async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const timestamp = new Date();
      if (currentFileId) {
        // Update existing entry
        await db.entries.update(currentFileId, {
          content,
          updatedAt: timestamp.getTime()
        });
      } else {
        // Create new entry
        const id = await db.entries.add({
          id: crypto.randomUUID(),
          userId,
          content,
          pageNumber,
          createdAt: timestamp.getTime(),
          updatedAt: timestamp.getTime(),
          size: new Blob([content]).size
        });
        // You might want to handle the new file ID here
      }
      setLastSaved(timestamp);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`relative w-full h-full bg-opacity-80 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      } rounded-lg shadow-2xl transform-gpu ${
        isActive ? 'scale-100' : 'scale-95'
      } transition-transform duration-300`}
    >
      <div className="absolute inset-0 p-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full h-full resize-none bg-transparent ${font} ${textColor} focus:outline-none`}
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
          }}
          placeholder="Begin writing your thoughts..."
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={pageNumber === 1}
          className={`p-2 rounded-full ${
            pageNumber === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-900/20'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className={`${textColor} opacity-60`}>Page {pageNumber}</span>
        <button
          onClick={onNext}
          className="p-2 rounded-full hover:bg-red-900/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {lastSaved && (
        <div className="absolute top-4 right-4 text-xs opacity-60">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default JournalPage;