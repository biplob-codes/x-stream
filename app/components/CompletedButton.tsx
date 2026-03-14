"use client";
import { useState } from "react";

interface Props {
  videoId: string;
  initialState: boolean;
}

const CompletedButton = ({ videoId, initialState }: Props) => {
  const [isCompleted, setIsCompleted] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    setIsCompleted((prev) => !prev);
    try {
      const res = await fetch(`/api/videos/${videoId}/completed`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setIsCompleted((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer justify-center w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      Mark as Uncomplete
    </button>
  );
};

export default CompletedButton;
