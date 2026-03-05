"use client";

interface Props {
  filePath: string;
  filename: string;
  totalVideos?: number;
}

const VideoPlayer = ({ filePath, filename, totalVideos }: Props) => {
  const streamUrl = `/api/stream?path=${encodeURIComponent(filePath)}`;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex-1 bg-black rounded-md  overflow-hidden">
        <video
          key={filePath}
          src={streamUrl}
          controls
          className="w-full h-full object-contain"
        />
      </div>
      <div className="px-1 flex justify-between items-center">
        <p className="text-sm text-gray-800 font-medium truncate">{filename}</p>
        <p className="text-xs text-gray-400">
          {totalVideos} video{totalVideos !== 1 ? "s" : ""} remaining
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
