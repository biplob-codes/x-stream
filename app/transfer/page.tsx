"use client";
import { useEffect, useState, useCallback } from "react";
import VideoPlayer from "./VideoPlayer";
import TagSelector from "./TagSelector";
import CategoryPanel from "./CategoryPanel";
import { cleanFilename } from "../lib/cleanFileName";

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
  const [editedFilename, setEditedFilename] = useState("");

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

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    if (currentVideo) {
      setEditedFilename(cleanFilename(currentVideo.filename));
    }
  }, [currentVideo]);

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
          newFilename: editedFilename,
          categoryId: category.id,
          tagIds: selectedTagIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Move failed:", data.error);
        return;
      }

      setSelectedTagIds([]);
      setVideos((prev) => prev.filter((_, i) => i !== currentIndex));
      setCurrentIndex((prev) =>
        prev >= videos.length - 1 ? Math.max(0, prev - 1) : prev,
      );
    } catch (error) {
      console.error("Move error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 dark:text-gray-500 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left — video + tags */}
      <div className="flex flex-col flex-1 px-4 pt-2 gap-3 overflow-hidden">
        {/* Video player */}
        <div className="flex-1 overflow-hidden">
          {currentVideo ? (
            <VideoPlayer
              filePath={currentVideo.path}
              filename={currentVideo.filename}
              totalVideos={videos.length}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No videos in inbox
              </p>
            </div>
          )}
        </div>

        {/* Editable filename */}
        {currentVideo && (
          <div className="shrink-0">
            <input
              type="text"
              value={editedFilename}
              onChange={(e) => setEditedFilename(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:border-[#1a1a2e] dark:focus:border-gray-500 transition-colors"
            />
          </div>
        )}

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
