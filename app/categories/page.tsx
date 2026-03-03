import { prisma } from "@/app/lib/prisma";
import CategoryCard from "./CategoryCard";

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      videos: {
        take: 4,
        orderBy: { createdAt: "desc" },
        select: { thumbnailPath: true },
      },
      _count: { select: { videos: true } },
    },
    orderBy: {
      videos: { _count: "desc" },
    },
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 px-4 pt-2 pb-3 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-900">Categories</h1>
        <p className="text-xs text-gray-400">{categories.length} categories</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {categories.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">
              No categories yet. Create one in Transfer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3   gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                videoCount={cat._count.videos}
                thumbnails={cat.videos.map((v) => v.thumbnailPath)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
