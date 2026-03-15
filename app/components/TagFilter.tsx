"use client";
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
      selectedIds
        .filter((id) => id !== tagId)
        .forEach((id) => params.append("tagId", id));
    } else {
      [...selectedIds, tagId].forEach((id) => params.append("tagId", id));
    }
    router.push(`/?${params.toString()}`);
  };

  const handleAllClick = () => router.push("/");
  const isAllSelected = selectedIds.length === 0;

  return (
    <>
      <button
        onClick={handleAllClick}
        className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 cursor-pointer
        ${
          isAllSelected
            ? "bg-[#1a1a2e] dark:bg-white text-white dark:text-[#1a1a2e]"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 cursor-pointer
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
    </>
  );
};

export default TagFilter;
