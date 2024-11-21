import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Lock } from 'lucide-react';

interface CollectionsProps {
  userId: string;
  onClose: () => void;
  onLoadCollection: (entries: any[]) => void;
}

const Collections: React.FC<CollectionsProps> = ({ userId, onClose, onLoadCollection }) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);

  const collections = useLiveQuery(
    () => db.collections.where('userId').equals(userId).toArray(),
    [userId]
  );

  const handleSaveCurrentPages = async () => {
    if (!newCollectionName.trim()) {
      alert('Please enter a collection name');
      return;
    }

    try {
      // Get current entries
      const entries = await db.entries
        .where('userId')
        .equals(userId)
        .toArray();

      // Create new collection
      const collection = await db.collections.add({
        userId,
        name: newCollectionName,
        createdAt: new Date()
      });

      // Update entries with collection ID
      await Promise.all(
        entries.map(entry =>
          db.entries.put({
            ...entry,
            collectionId: collection
          })
        )
      );

      setNewCollectionName('');
      setShowNewCollection(false);
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save collection');
    }
  };

  const handleLoadCollection = async (collectionId: string) => {
    try {
      const entries = await db.entries
        .where('collectionId')
        .equals(collectionId)
        .toArray();

      onLoadCollection(entries);
      onClose();
    } catch (error) {
      console.error('Error loading collection:', error);
      alert('Failed to load collection');
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      // Remove collection ID from entries
      await db.entries
        .where('collectionId')
        .equals(collectionId)
        .modify(entry => {
          delete entry.collectionId;
        });

      // Delete collection
      await db.collections.delete(collectionId);
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 right-4 w-80 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Collections</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {collections?.map(collection => (
          <div
            key={collection.id}
            className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
          >
            <div>
              <h4 className="font-medium">{collection.name}</h4>
              <p className="text-xs opacity-75">
                {new Date(collection.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLoadCollection(collection.id!)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                Load
              </button>
              <button
                onClick={() => handleDeleteCollection(collection.id!)}
                className="p-1 hover:bg-red-900/40 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showNewCollection ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection name"
            className="w-full px-3 py-2 bg-black/20 rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowNewCollection(false)}
              className="px-3 py-1 hover:bg-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCurrentPages}
              className="px-3 py-1 bg-red-900/40 hover:bg-red-900/60 rounded"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNewCollection(true)}
          className="w-full py-2 bg-red-900/40 hover:bg-red-900/60 rounded"
        >
          Save Current Pages
        </button>
      )}
    </motion.div>
  );
};

export default Collections;
