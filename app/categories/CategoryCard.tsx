import Image from "next/image";
import Link from "next/link";
import { Film } from "lucide-react";

interface Props {
  id: string;
  name: string;
  videoCount: number;
  thumbnails: (string | null)[];
}

const CategoryCard = ({ id, name, videoCount, thumbnails }: Props) => {
  const slots = [0, 1, 2, 3].map((i) => thumbnails[i] ?? null);

  return (
    <Link href={`/categories/${id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 group cursor-pointer">
        <div
          className="grid grid-cols-2 grid-rows-2"
          style={{ aspectRatio: "16/9" }}
        >
          {slots.map((thumb, i) => (
            <div
              key={i}
              className="relative bg-gray-100 dark:bg-gray-800 overflow-hidden"
            >
              {thumb ? (
                <Image
                  src={thumb}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film
                    size={20}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-3 py-2.5 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
            {name}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
