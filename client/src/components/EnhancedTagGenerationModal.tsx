import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface CategorizedTags {
  emotional: string[];
  pacing: string[];
  vibes: string[];
  aesthetic: string[];
  tropes: string[];
  general: string[];
}

interface EnhancedTagGenerationModalProps {
  bookTitle: string;
  bookAuthor: string;
  bookDescription?: string;
  initialTags?: string[];
  onSave: (allTags: string[], selectedTags: string[]) => void;
  onClose: () => void;
}

const categoryConfig = {
  emotional: {
    label: '💔 Emotional Impact',
    color: 'bg-pink-100 text-pink-800 border-pink-300',
    selectedColor: 'bg-pink-500 text-white'
  },
  pacing: {
    label: '⚡ Pacing & Experience',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    selectedColor: 'bg-blue-500 text-white'
  },
  vibes: {
    label: '✨ Character Vibes',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    selectedColor: 'bg-purple-500 text-white'
  },
  aesthetic: {
    label: '🎨 Aesthetic & Atmosphere',
    color: 'bg-green-100 text-green-800 border-green-300',
    selectedColor: 'bg-green-500 text-white'
  },
  tropes: {
    label: '📚 Tropes',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    selectedColor: 'bg-orange-500 text-white'
  },
  general: {
    label: '📖 General',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    selectedColor: 'bg-gray-500 text-white'
  }
};

const EnhancedTagGenerationModal: React.FC<EnhancedTagGenerationModalProps> = ({
  bookTitle,
  bookAuthor,
  bookDescription,
  initialTags = [],
  onSave,
  onClose,
}) => {
  const [categorizedTags, setCategorizedTags] = useState<CategorizedTags | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [useCategorized, setUseCategorized] = useState<boolean>(true);

  useEffect(() => {
    // If there are already initial tags, use them and do not re-fetch
    if (initialTags && initialTags.length > 0) {
      setAllTags(initialTags);
      setSelectedTags(new Set()); // Start with no tags selected
      setUseCategorized(false); // Use simple view for existing tags
      return; // Skip API call
    }
    const fetchTags = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/chatgpt/generate-categorized-tags', {
          title: bookTitle,
          author: bookAuthor,
          description: bookDescription,
        });
        
        if (res.data.categorized) {
          setCategorizedTags(res.data.categorized);
          setUseCategorized(true);
        }
        setAllTags(res.data.tags);
        setSelectedTags(new Set()); // Do not auto-select any tags
      } catch (error) {
        console.error('Error generating tags:', error);
        // Fallback to regular tags if categorized endpoint fails
        try {
          const res = await axios.post('/api/chatgpt/generate-tags', {
            title: bookTitle,
            author: bookAuthor,
            description: bookDescription,
          });
          setAllTags(res.data.tags);
          setUseCategorized(false);
        } catch (fallbackError) {
          console.error('Error generating fallback tags:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    onSave(allTags, Array.from(selectedTags));
  };

  const renderCategorizedTags = () => {
    if (!categorizedTags) return null;

    return (
      <div className="space-y-4">
        {Object.entries(categorizedTags).map(([category, tags]) => {
          if (tags.length === 0) return null;
          const config = categoryConfig[category as keyof typeof categoryConfig];
          
          return (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-2 text-bookBrown">
                {config.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <button
                    key={`${category}-${tag}`}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      selectedTags.has(tag)
                        ? config.selectedColor
                        : config.color
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSimpleTags = () => (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag: string) => (
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
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bookBeige text-bookBrown rounded-lg shadow-xl p-6 relative max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-bookBrown hover:text-bookAccent"
          title="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {useCategorized ? '✨ AI-Generated Book Vibes' : 'Suggested Tags'}
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <p className="mb-2">🤖 Analyzing book vibes...</p>
            <p className="text-sm text-gray-600">Getting those BookTok-worthy tags</p>
          </div>
        ) : (
          <>
            {useCategorized && categorizedTags ? renderCategorizedTags() : renderSimpleTags()}
            
            {selectedTags.size > 0 && (
              <div className="mt-4 p-3 bg-bookAccent/10 rounded-lg">
                <p className="text-sm text-bookBrown">
                  Selected {selectedTags.size} tag{selectedTags.size !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-bookAccent text-white rounded hover:bg-bookAccentHover transition"
            disabled={selectedTags.size === 0}
          >
            Save {selectedTags.size} Tag{selectedTags.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTagGenerationModal;