import { prisma } from "@/app/lib/prisma";
import CategoryVideoCard from "../CategoryVideoCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import RandomButton from "@/app/components/RandomButton";

const VIDEOS_PER_PAGE = 15;

type SortKey = "duration" | "size" | "createdAt";
type SortDir = "asc" | "desc";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; sort?: string; dir?: string }>;
}

const SORT_OPTIONS: { value: SortKey; descLabel: string; ascLabel: string }[] =
  [
    { value: "createdAt", descLabel: "Newest", ascLabel: "Oldest" },
    { value: "duration", descLabel: "Longest", ascLabel: "Shortest" },
    { value: "size", descLabel: "Largest", ascLabel: "Smallest" },
  ];

const CategoryDetailPage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const { page, sort, dir } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const currentSort: SortKey =
    sort === "duration" || sort === "size" ? sort : "createdAt";
  const currentDir: SortDir = dir === "asc" ? "asc" : "desc";
  const skip = (currentPage - 1) * VIDEOS_PER_PAGE;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { videos: true } } },
  });

  if (!category) return notFound();

  const videos = await prisma.video.findMany({
    where: { categoryId: id },
    orderBy: { [currentSort]: currentDir },
    skip,
    take: VIDEOS_PER_PAGE,
    select: {
      id: true,
      filename: true,
      thumbnailPath: true,
      duration: true,
      size: true,
      resolution: true,
    },
  });

  const allVideos = await prisma.video.findMany({
    where: { categoryId: id },
    select: { id: true },
  });

  const totalPages = Math.ceil(category._count.videos / VIDEOS_PER_PAGE);

  const buildHref = (newSort: SortKey, newDir: SortDir, newPage = 1) =>
    `/categories/${id}?sort=${newSort}&dir=${newDir}&page=${newPage}`;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 px-4 pt-2 pb-3 border-b border-gray-100 dark:border-gray-800">
        <Link
          href="/categories"
          className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-2"
        >
          <ChevronLeft size={13} />
          Back to Categories
        </Link>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {category.name}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {category._count.videos}{" "}
              {category._count.videos === 1 ? "video" : "videos"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {SORT_OPTIONS.map(({ value, descLabel, ascLabel }) => {
              const isActiveSort = currentSort === value;
              // clicking the active button flips direction; clicking inactive defaults to desc
              const nextDir: SortDir = isActiveSort
                ? currentDir === "desc"
                  ? "asc"
                  : "desc"
                : "desc";
              const label = isActiveSort
                ? currentDir === "desc"
                  ? descLabel
                  : ascLabel
                : descLabel;

              return (
                <Link
                  key={value}
                  href={buildHref(value, nextDir)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${
                      isActiveSort
                        ? "bg-[#1a1a2e] dark:bg-white text-white dark:text-[#1a1a2e]"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
            {totalPages > 1 && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
            <RandomButton videoIds={allVideos.map((v) => v.id)} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {videos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No videos in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <CategoryVideoCard
                key={video.id}
                filename={video.filename}
                thumbnailPath={video.thumbnailPath}
                duration={video.duration}
                size={video.size}
                resolution={video.resolution}
                id={video.id}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {currentPage > 1 && (
              <Link
                href={buildHref(currentSort, currentDir, currentPage - 1)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildHref(currentSort, currentDir, p)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors
                  ${
                    p === currentPage
                      ? "bg-[#1a1a2e] dark:bg-white text-white dark:text-[#1a1a2e]"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {p}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link
                href={buildHref(currentSort, currentDir, currentPage + 1)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
