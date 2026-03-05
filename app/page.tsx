import { prisma } from "./lib/prisma";
import VideoCard from "./components/VideoCard";
import TagFilter from "./components/TagFilter";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ tagId?: string | string[] }>;
}

const HomePage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const tagIds = params.tagId
    ? Array.isArray(params.tagId)
      ? params.tagId
      : [params.tagId]
    : [];

  const videos = await prisma.video.findMany({
    where:
      tagIds.length > 0
        ? {
            isCompleted: false,
            isDeleted: false,
            AND: tagIds.map((tagId) => ({
              videoTags: { some: { tagId } },
            })),
          }
        : { isCompleted: false, isDeleted: false },
    include: {
      category: true,
      videoTags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Tag filter bar */}
      <div className="shrink-0 px-4 pt-1 pb-2 border-b border-gray-100">
        <Suspense fallback={null}>
          <TagFilter tags={tags} />
        </Suspense>
      </div>

      {/* Video grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {videos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No videos found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3   gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                isFavourite={video.isFavourite}
                isCompleted={video.isCompleted}
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
