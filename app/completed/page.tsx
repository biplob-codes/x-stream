import { prisma } from "@/app/lib/prisma";
import CompletedVideoCard from "./CompletedVideoCard";

const CompletedPage = async () => {
  const videos = await prisma.video.findMany({
    where: { isCompleted: true },
    orderBy: { isDeleted: "asc" },
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-900">Completed</h1>
        <p className="text-xs text-gray-400">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {videos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No completed videos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3   gap-4">
            {videos.map((video) => (
              <CompletedVideoCard
                key={video.id}
                id={video.id}
                filename={video.filename}
                thumbnailPath={video.thumbnailPath}
                duration={video.duration}
                isDeleted={video.isDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedPage;
