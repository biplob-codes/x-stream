"use client";
import CompletedButton from "@/app/components/CompletedButton";
import DeleteButton from "@/app/components/DeleteButton";
import { Monitor } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  filename: string;
  thumbnailPath: string | null;
  duration: number | null;
  isDeleted: boolean;
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

const CompletedVideoCard = ({
  id,
  filename,
  thumbnailPath,
  duration,
  isDeleted,
}: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200">
      {isDeleted ? (
        <div
          className="relative w-full bg-gray-100 dark:bg-gray-800"
          style={{ aspectRatio: "16/9" }}
        >
          {thumbnailPath ? (
            <Image
              src={thumbnailPath}
              alt={filename}
              fill
              className="object-cover opacity-30 grayscale"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Monitor size={28} className="text-gray-200 dark:text-gray-700" />
            </div>
          )}
        </div>
      ) : (
        <Link href={`/videos/${id}`}>
          <div
            className="relative w-full bg-gray-100 dark:bg-gray-800"
            style={{ aspectRatio: "16/9" }}
          >
            {thumbnailPath ? (
              <Image
                src={thumbnailPath}
                alt={filename}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Monitor
                  size={28}
                  className="text-gray-300 dark:text-gray-600"
                />
              </div>
            )}
            {duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-medium px-1.5 py-0.5 rounded-md">
                {formatDuration(duration)}
              </div>
            )}
          </div>
        </Link>
      )}

      {!isDeleted && (
        <div className="p-2 flex gap-2">
          <div className="flex-1">
            <CompletedButton videoId={id} initialState={true} />
          </div>
          <div className="flex-1">
            <DeleteButton videoId={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedVideoCard;
