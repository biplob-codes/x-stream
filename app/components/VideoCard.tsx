import Image from "next/image";
import { Clock, HardDrive, Monitor, Tag, CheckCircle } from "lucide-react";
import FavouriteButton from "./FavouriteButton";
import Link from "next/link";
import { removeExtension } from "../lib/cleanFileName";

interface VideoCardProps {
  id: string;
  filename: string;
  thumbnailPath: string | null;
  duration: number | null;
  resolution: string | null;
  size: number | null;
  isFavourite: boolean;
  isCompleted: boolean;
  category: { name: string };
  videoTags: { tag: { id: string; name: string } }[];
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

const VideoCard = ({
  id,
  filename,
  thumbnailPath,
  duration,
  resolution,
  size,
  isFavourite,
  isCompleted,
  category,
  videoTags,
}: VideoCardProps) => {
  return (
    <Link href={`/videos/${id}`}>
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 group cursor-pointer">
        {/* Thumbnail */}
        <div
          className="relative w-full bg-gray-100"
          style={{ aspectRatio: "16/9" }}
        >
          {thumbnailPath ? (
            <Image
              src={thumbnailPath}
              alt={filename}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isCompleted ? "opacity-50" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Monitor size={32} className="text-gray-300" />
            </div>
          )}

          <FavouriteButton videoId={id} initialState={isFavourite} />

          {isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-green-500/80 rounded-full p-2">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
          )}

          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-medium px-1.5 py-0.5 rounded-md">
              {formatDuration(duration)}
            </div>
          )}

          <div className="absolute top-2 left-2 bg-[#1a1a2e]/80 text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
            {category.name}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-800 truncate">
            {removeExtension(filename)}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            {resolution && (
              <span className="flex items-center gap-1">
                <Monitor size={11} />
                {resolution}
              </span>
            )}
            {size && (
              <span className="flex items-center gap-1">
                <HardDrive size={11} />
                {formatSize(size)}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {formatDuration(duration)}
              </span>
            )}
          </div>

          {videoTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {videoTags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 px-2 py-0.5 bg-[#f0f4ff] text-[#1a1a2e] text-[11px] font-medium rounded-md"
                >
                  <Tag size={9} />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
