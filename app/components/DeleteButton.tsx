"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  videoId: string;
}

const DeleteButton = ({ videoId }: Props) => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    handleDelete();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-40
        ${
          confirming
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
      <Trash2 size={16} />
      {loading ? "Deleting..." : confirming ? "Confirm?" : "Delete"}
    </button>
  );
};

export default DeleteButton;
