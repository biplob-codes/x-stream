"use client";
import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  videoId: string;
  initialState: boolean;
}

const FavouriteButton = ({ videoId, initialState }: Props) => {
  const [isFavourite, setIsFavourite] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    // optimistic update
    setIsFavourite((prev) => !prev);

    try {
      const res = await fetch(`/api/videos/${videoId}/favourite`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      // revert on failure
      setIsFavourite((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 cursor-pointer
        ${
          isFavourite
            ? "bg-red-500 text-white"
            : "bg-black/40 text-white hover:bg-black/60"
        }`}
    >
      <Heart size={13} className={isFavourite ? "fill-white" : ""} />
    </button>
  );
};

export default FavouriteButton;
