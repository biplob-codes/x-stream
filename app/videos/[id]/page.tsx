import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { Clock, HardDrive, Monitor, Tag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import FavouriteButton from "@/app/components/FavouriteButton";
import CompletedButton from "@/app/components/CompletedButton";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "Unknown";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "Unknown";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

const VideoPage = async ({ params }: Props) => {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      category: true,
      videoTags: { include: { tag: true } },
    },
  });

  if (!video) return notFound();

  const relatedVideos = await prisma.video.findMany({
    where: {
      categoryId: video.categoryId,
      id: { not: id },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  const streamUrl = `/api/stream?path=${encodeURIComponent(video.path)}`;

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ height: "100vh", maxWidth: "100%" }}
    >
      {/* Left — video + info */}
      <div className="flex flex-col flex-1 overflow-y-auto   p-4 gap-4 min-w-0">
        {" "}
        {/* Back */}
        <Link
          href="/"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors w-fit"
        >
          <ChevronLeft size={13} />
          Back
        </Link>
        {/* Video player */}
        <div
          className="w-full bg-black rounded-xl overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          <video
            src={streamUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {video.filename}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-[#f0f4ff] text-[#1a1a2e] text-xs font-medium rounded-md">
              {video.category.name}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <FavouriteButton
              videoId={video.id}
              initialState={video.isFavourite}
            />
            <CompletedButton
              videoId={video.id}
              initialState={video.isCompleted}
            />
          </div>
        </div>
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {video.resolution && (
            <span className="flex items-center gap-1">
              <Monitor size={12} />
              {video.resolution}
            </span>
          )}
          {video.size && (
            <span className="flex items-center gap-1">
              <HardDrive size={12} />
              {formatSize(video.size)}
            </span>
          )}
          {video.duration && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDuration(video.duration)}
            </span>
          )}
        </div>
        {/* Tags */}
        {video.videoTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {video.videoTags.map(({ tag }) => (
              <span
                key={tag.id}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#f0f4ff] text-[#1a1a2e] text-xs font-medium rounded-lg"
              >
                <Tag size={10} />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right — related videos */}
      <div className="w-72 shrink-0 border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <p className="text-xs font-medium text-gray-400 tracking-wide uppercase">
            More from {video.category.name}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {relatedVideos.length === 0 ? (
            <p className="text-xs text-gray-400 text-center mt-4">
              No other videos in this category
            </p>
          ) : (
            relatedVideos.map((related) => (
              <Link key={related.id} href={`/videos/${related.id}`}>
                <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  {/* Thumbnail */}
                  <div
                    className="relative bg-gray-100 rounded-md overflow-hidden shrink-0"
                    style={{ width: 96, aspectRatio: "16/9" }}
                  >
                    {related.thumbnailPath ? (
                      <Image
                        src={related.thumbnailPath}
                        alt={related.filename}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Monitor size={16} className="text-gray-300" />
                      </div>
                    )}
                    {related.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                        {formatDuration(related.duration)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {related.filename}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
