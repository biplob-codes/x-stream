"use client";
import { useState } from "react";
import { Plus, Folder } from "lucide-react";

interface Category {
  id: string;
  name: string;
  folderPath: string;
}

interface Props {
  categories: Category[];
  selectedTagIds: string[];
  onCategoryClick: (category: Category) => void;
  onCategoryCreate: (name: string) => void;
}

const CategoryPanel = ({
  categories,
  selectedTagIds,
  onCategoryClick,
  onCategoryCreate,
}: Props) => {
  const [input, setInput] = useState("");

  const canMove = selectedTagIds.length > 0;

  const handleCreate = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onCategoryCreate(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          Categories
        </p>
      </div>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto p-2">
        {categories.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-6">
            No categories yet
          </p>
        )}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => canMove && onCategoryClick(category)}
            title={!canMove ? "Select at least one tag first" : category.name}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150 mb-0.5
              ${
                canMove
                  ? "text-gray-700 hover:bg-[#f0f4ff] hover:text-[#1a1a2e] cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
          >
            <Folder size={16} className="shrink-0" />
            <span className="truncate text-left">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Create new category */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New category..."
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none focus:border-[#1a1a2e] transition-colors"
          />
          <button
            onClick={handleCreate}
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-[#1a1a2e] text-white disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
        {!canMove && (
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            Select tags to enable moving
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryPanel;
