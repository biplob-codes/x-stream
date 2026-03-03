import { prisma } from "./lib/prisma";
import VideoCard from "./components/VideoCard";

const HomePage = async () => {
  const videos = await prisma.video.findMany({
    include: {
      category: true,
      videoTags: {
        include: { tag: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Tag filter bar */}
      <div className="shrink-0 px-4   pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mr-1">
            Filter
          </span>
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {videos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">
              No videos yet. Go to Transfer to add some.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3   gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                filename={video.filename}
                thumbnailPath={video.thumbnailPath}
                duration={video.duration}
                resolution={video.resolution}
                size={video.size}
                category={video.category}
                videoTags={video.videoTags}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
