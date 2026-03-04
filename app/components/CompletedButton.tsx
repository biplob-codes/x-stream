"use client";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
        ${
          isCompleted
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
    >
      <CheckCircle size={16} />
      {isCompleted ? "Completed" : "Mark as Completed"}
    </button>
  );
};

export default CompletedButton;
