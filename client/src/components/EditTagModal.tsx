import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface EditTagModalProps {
  bookTitle: string;
  bookAuthor: string;
  bookDescription?: string;
  // The tags currently selected for the book (user-specific selection)
  currentTags: string[];
  // The global tags available for the book (from the book record)
  globalTags: string[];
  onSave: (newTags: string[]) => void;
  onClose: () => void;
}

const EditTagModal: React.FC<EditTagModalProps> = ({
  bookTitle,
  bookAuthor,
  bookDescription,
  currentTags,
  globalTags,
  onSave,
  onClose,
}) => {
  // Use a Set for selected tags for easy add/remove operations.
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(currentTags));
  // This state will hold any newly generated tags from the API.
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  // For manually adding a tag.
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Compute available tags as union of globalTags and generatedTags,
  // then remove any that are already selected.
  const availableTags = Array.from(new Set([...globalTags, ...generatedTags])).filter(
    (tag) => !selectedTags.has(tag)
  );

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      newSet.delete(tag);
      return newSet;
    });
  };

  const handleAddTag = (tag: string) => {
    setSelectedTags((prev) => new Set(prev).add(tag));
  };

  const handleAddNewTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !selectedTags.has(trimmed)) {
      setSelectedTags((prev) => new Set(prev).add(trimmed));
      // Optionally, add the new tag to generatedTags so it shows in availableTags
      setGeneratedTags((prev) => [...prev, trimmed]);
      setNewTagInput('');
    }
  };

  const handleGenerateNewTags = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/chatgpt/generate-tags', {
        title: bookTitle,
        author: bookAuthor,
        description: bookDescription,
      });
      const tags: string[] = res.data.tags;
      // Merge generated tags with any already in state (avoid duplicates)
      setGeneratedTags((prev) => Array.from(new Set([...prev, ...tags])));
    } catch (error) {
      console.error('Error generating tags:', error);
      alert('Failed to generate new tags. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave(Array.from(selectedTags));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bookBeige text-bookBrown rounded-lg shadow-xl p-6 relative max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-bookBrown hover:text-bookAccent"
          title="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Tags</h2>
        
        {/* Selected Tags Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Your Tags:</h3>
          {selectedTags.size > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedTags).map((tag, index) => (
                <div key={index} className="flex items-center bg-bookAccent text-white rounded-full text-xs px-2 py-1">
                  <span>{tag}</span>
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-bookBrown/70">No tags selected.</p>
          )}
        </div>

        {/* Available Tags Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Available Tags:</h3>
          {availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleAddTag(tag)}
                  className="px-2 py-1 bg-white text-bookBrown border border-bookBorder rounded-full text-xs hover:bg-bookAccent hover:text-white transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-bookBrown/70">No additional tags available.</p>
          )}
        </div>

        {/* Add New Tag Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Add New Tag:</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Enter new tag"
              className="flex-1 px-2 py-1 border border-bookBorder rounded focus:outline-none"
            />
            <button
              onClick={handleAddNewTag}
              className="px-3 py-1 bg-bookAccent text-white rounded hover:bg-bookAccentHover transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Generate New Tags Link */}
        <div className="mb-4">
          <button
            onClick={handleGenerateNewTags}
            className="text-sm text-bookAccent hover:underline"
            disabled={loading}
          >
            {loading ? 'Generating tags...' : 'Generate new tags'}
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-bookAccent text-white rounded hover:bg-bookAccentHover transition"
          >
            Save Tags
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTagModal;
