"use client";

interface Props {
  filePath: string;
  filename: string;
}

const VideoPlayer = ({ filePath, filename }: Props) => {
  const streamUrl = `/api/stream?path=${encodeURIComponent(filePath)}`;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex-1 bg-black rounded-xl overflow-hidden">
        <video
          key={filePath}
          src={streamUrl}
          controls
          className="w-full h-full object-contain"
        />
      </div>
      <div className="px-1">
        {/* <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-1">
          Now Playing
        </p> */}
        <p className="text-sm text-gray-800 font-medium truncate">{filename}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
