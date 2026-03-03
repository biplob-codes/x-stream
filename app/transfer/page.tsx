"use client";
import { useEffect, useState, useCallback } from "react";
import VideoPlayer from "./VideoPlayer";
import TagSelector from "./TagSelector";
import CategoryPanel from "./CategoryPanel";
import { RefreshCw } from "lucide-react";

interface Video {
  filename: string;
  path: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  folderPath: string;
}

export default function TransferPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [videosRes, tagsRes, categoriesRes] = await Promise.all([
        fetch("/api/new-videos"),
        fetch("/api/tags"),
        fetch("/api/categories"),
      ]);
      const [videosData, tagsData, categoriesData] = await Promise.all([
        videosRes.json(),
        tagsRes.json(),
        categoriesRes.json(),
      ]);
      setVideos(videosData.videos || []);
      setTags(tagsData.tags || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleTagSelect = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleTagCreate = async (name: string) => {
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (data.tag) setTags((prev) => [...prev, data.tag]);
  };

  const handleCategoryCreate = async (name: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (data.category) setCategories((prev) => [...prev, data.category]);
  };

  const handleCategoryClick = async (category: Category) => {
    const current = videos[currentIndex];
    if (!current) return;

    try {
      const res = await fetch("/api/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: current.filename,
          categoryId: category.id,
          tagIds: selectedTagIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Move failed:", data.error);
        return;
      }

      // clear tags and advance to next video
      setSelectedTagIds([]);
      setVideos((prev) => prev.filter((_, i) => i !== currentIndex));
      setCurrentIndex((prev) =>
        prev >= videos.length - 1 ? Math.max(0, prev - 1) : prev,
      );
    } catch (error) {
      console.error("Move error:", error);
    }
  };

  const currentVideo = videos[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left — video + tags */}
      <div className="flex flex-col flex-1 p-4 gap-3 overflow-hidden">
        {/* Top bar */}
        {/* <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Transfer</h1>
            <p className="text-xs text-gray-400">
              {videos.length} video{videos.length !== 1 ? "s" : ""} remaining
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div> */}

        {/* Video player */}
        <div className="flex-1 overflow-hidden">
          {currentVideo ? (
            <VideoPlayer
              filePath={currentVideo.path}
              filename={currentVideo.filename}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-400">No videos in inbox</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="shrink-0">
          <TagSelector
            tags={tags}
            selectedTagIds={selectedTagIds}
            onTagSelect={handleTagSelect}
            onTagCreate={handleTagCreate}
          />
        </div>
      </div>

      {/* Right — categories */}
      <div className="w-[20%] shrink-0 overflow-hidden">
        <CategoryPanel
          categories={categories}
          selectedTagIds={selectedTagIds}
          onCategoryClick={handleCategoryClick}
          onCategoryCreate={handleCategoryCreate}
        />
      </div>
    </div>
  );
}
