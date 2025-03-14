import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface TagGenerationModalProps {
  bookTitle: string;
  bookAuthor: string;
  bookDescription?: string;
  initialTags?: string[];
  onSave: (allTags: string[], selectedTags: string[]) => void;
  onClose: () => void;
}

const TagGenerationModal: React.FC<TagGenerationModalProps> = ({
  bookTitle,
  bookAuthor,
  bookDescription,
  initialTags = [],
  onSave,
  onClose,
}) => {
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(initialTags));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // If there are already initial tags, use them and do not re-fetch
    if (initialTags && initialTags.length > 0) {
      setSuggestedTags(initialTags);
      setSelectedTags(new Set()); // Start with no tags selected
      return; // Skip API call
    }
    const fetchTags = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/chatgpt/generate-tags', {
          title: bookTitle,
          author: bookAuthor,
          description: bookDescription,
        });
        const tags: string[] = res.data.tags;
        // Merge suggested tags with initial tags (without duplicates)
        setSuggestedTags(tags);
        setSelectedTags(new Set()); // Do not auto-select any tags
      } catch (error) {
        console.error('Error generating tags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [bookTitle, bookAuthor, bookDescription]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    onSave(suggestedTags, Array.from(selectedTags));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bookBeige text-bookBrown rounded-lg shadow-xl p-6 relative max-w-md w-full max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-bookBrown hover:text-bookAccent"
          title="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Suggested Tags</h2>
        {loading ? (
          <p className="text-center">Generating tags...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full border text-sm transition 
                  ${selectedTags.has(tag)
                    ? 'bg-bookAccent text-white'
                    : 'bg-white text-bookBrown border-bookBorder'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-center">
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

export default TagGenerationModal;
