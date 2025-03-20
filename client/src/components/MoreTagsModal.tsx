import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MoreTagsModalProps {
  availableTags: { tag: string; count: number }[];
  initialSelectedTags: string[];
  onApply: (selectedTags: string[]) => void;
  onClose: () => void;
}

const MoreTagsModal: React.FC<MoreTagsModalProps> = ({
  availableTags,
  initialSelectedTags,
  onApply,
  onClose,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelectedTags));

  const toggleTag = (tag: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bookBeige text-bookBrown rounded-lg shadow-xl p-6 relative max-w-md w-full max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-bookBrown hover:text-bookAccent" title="Close">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Select Tags</h2>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((item, index) => {
            const isSelected = selected.has(item.tag);
            return (
              <button
                key={index}
                onClick={() => toggleTag(item.tag)}
                className={`px-3 py-1 rounded-full border ${
                  isSelected
                    ? 'bg-bookAccent text-white'
                    : 'bg-white text-bookBrown border-bookBorder'
                }`}
              >
                {item.tag} ({item.count})
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => onApply(Array.from(selected))}
            className="px-4 py-2 bg-bookAccent text-white rounded hover:bg-bookAccentHover transition"
          >
            Apply Filters
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreTagsModal;
