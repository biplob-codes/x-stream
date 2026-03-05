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
    <div className="bg-white rounded border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
      {/* Thumbnail */}
      {isDeleted ? (
        <div
          className="relative w-full bg-gray-100"
          style={{ aspectRatio: "16/9" }}
        >
          {thumbnailPath ? (
            <Image
              src={thumbnailPath}
              alt={filename}
              fill
              className="object-cover opacity-90 cursor-not-allowed  "
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Monitor size={28} className="text-gray-200" />
            </div>
          )}
        </div>
      ) : (
        <Link href={`/videos/${id}`}>
          <div
            className="relative w-full bg-gray-100"
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
                <Monitor size={28} className="text-gray-300" />
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

      {/* Actions — hidden when deleted */}
      {!isDeleted && (
        <div className="p-2 flex justify-between gap-2">
          <div className="flex-1">
            <CompletedButton videoId={id} initialState={true} />
          </div>
          <div className=" ">
            <DeleteButton videoId={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedVideoCard;
