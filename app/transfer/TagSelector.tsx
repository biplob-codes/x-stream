"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

interface Props {
  tags: Tag[];
  selectedTagIds: string[];
  onTagSelect: (tagId: string) => void;
  onTagCreate: (name: string) => void;
}

const TagSelector = ({
  tags,
  selectedTagIds,
  onTagSelect,
  onTagCreate,
}: Props) => {
  const [input, setInput] = useState("");

  const handleCreate = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onTagCreate(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 bg-white dark:bg-gray-900">
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => onTagSelect(tag.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                ${
                  isSelected
                    ? "bg-[#1a1a2e] dark:bg-white text-white dark:text-[#1a1a2e]"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New tag..."
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#1a1a2e] dark:focus:border-gray-500 transition-colors"
        />
        <button
          onClick={handleCreate}
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-[#1a1a2e] dark:bg-white text-white dark:text-[#1a1a2e] disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export default TagSelector;
