import Image from "next/image";
import { Clock, Monitor } from "lucide-react";
import Link from "next/link";

interface Props {
  filename: string;
  thumbnailPath: string | null;
  duration: number | null;
  id:string
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

const CategoryVideoCard = ({ filename, thumbnailPath, duration,id }: Props) => {
  return (
   <Link href={`/videos/${id}`}>
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 group cursor-pointer">
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
            className="object-cover group-hover:scale-105 transition-transform duration-300"
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

      {/* Name */}
      <div className="px-3 py-2.5">
        <p
          className="text-xs font-medium text-gray-700 truncate"
          title={filename}
        >
          {filename}
        </p>
      </div>
    </div></Link>
  );
};

export default CategoryVideoCard;
