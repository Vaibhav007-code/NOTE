import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
}

const fonts = [
  { name: 'Serif', class: 'font-serif' },
  { name: 'Sans', class: 'font-sans' },
  { name: 'Mono', class: 'font-mono' },
  { name: 'Gothic', class: 'font-gothic' },
  { name: 'Cursive', class: 'font-cursive' },
  { name: 'Elegant', class: 'font-elegant' },
  { name: 'Vintage', class: 'font-vintage' },
  { name: 'Modern', class: 'font-modern' },
];

const colors = [
  { name: 'Blood Red', class: 'text-red-600' },
  { name: 'Crimson', class: 'text-red-700' },
  { name: 'Dark Red', class: 'text-red-900' },
  { name: 'Purple', class: 'text-purple-600' },
  { name: 'Violet', class: 'text-violet-600' },
  { name: 'Deep Blue', class: 'text-blue-800' },
  { name: 'Forest Green', class: 'text-green-800' },
  { name: 'Gold', class: 'text-yellow-600' },
  { name: 'Silver', class: 'text-gray-400' },
  { name: 'Bronze', class: 'text-amber-700' },
  { name: 'Rose', class: 'text-rose-400' },
  { name: 'Midnight', class: 'text-indigo-900' },
];

const Settings: React.FC<SettingsProps> = ({
  onClose,
  selectedFont,
  setSelectedFont,
  textColor,
  setTextColor,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl p-6 m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-red-500 mb-6">Appearance Settings</h2>

        <div className="space-y-8">
          {/* Font Selection */}
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-4">Font Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {fonts.map((font) => (
                <button
                  key={font.class}
                  onClick={() => setSelectedFont(font.class)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedFont === font.class
                      ? 'bg-red-900/40 text-red-400'
                      : 'hover:bg-red-900/20 text-red-400/60'
                  }`}
                >
                  <span className={font.class}>{font.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-4">Text Color</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {colors.map((color) => (
                <button
                  key={color.class}
                  onClick={() => setTextColor(color.class)}
                  className={`p-3 rounded-lg transition-colors ${
                    textColor === color.class
                      ? 'bg-red-900/40'
                      : 'hover:bg-red-900/20'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${color.class} ring-2 ring-offset-2 ring-offset-gray-900 ring-current`} />
                    <span className={`text-xs ${color.class}`}>{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 rounded-lg bg-gray-800">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Preview</h3>
            <p className={`${selectedFont} ${textColor}`}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;