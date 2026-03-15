"use client";
import { Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  videoIds: string[];
}

const RandomButton = ({ videoIds }: Props) => {
  const router = useRouter();

  const handleRandom = () => {
    if (videoIds.length === 0) return;
    const randomId = videoIds[Math.floor(Math.random() * videoIds.length)];
    router.push(`/videos/${randomId}`);
  };

  if (videoIds.length === 0) return null;

  return (
    <button
      onClick={handleRandom}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1a1a2e] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1a2e] transition-all duration-150 cursor-pointer shrink-0"
    >
      <Shuffle size={13} />
      Random
    </button>
  );
};

export default RandomButton;
