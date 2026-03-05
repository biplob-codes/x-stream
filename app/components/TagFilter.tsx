"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Tag {
  id: string;
  name: string;
}

interface Props {
  tags: Tag[];
}

const TagFilter = ({ tags }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIds = searchParams.getAll("tagId");

  const handleTagClick = (tagId: string) => {
    const params = new URLSearchParams();

    if (selectedIds.includes(tagId)) {
      // deselect it
      selectedIds
        .filter((id) => id !== tagId)
        .forEach((id) => params.append("tagId", id));
    } else {
      // if "all" was selected before, clear and select only this
      // if others were selected, add this one too
      [...selectedIds, tagId].forEach((id) => params.append("tagId", id));
    }

    router.push(`/?${params.toString()}`);
  };

  const handleAllClick = () => {
    router.push("/");
  };

  const isAllSelected = selectedIds.length === 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* All button */}
      <button
        onClick={handleAllClick}
        className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 cursor-pointer
          ${
            isAllSelected
              ? "bg-[#1a1a2e] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
      >
        All
      </button>

      {tags.map((tag) => {
        const isSelected = selectedIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`px-3 py-1.5 rounded  text-xs font-medium transition-all duration-150 cursor-pointer
              ${
                isSelected
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;
