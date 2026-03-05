-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "thumbnailPath" TEXT,
    "duration" REAL,
    "resolution" TEXT,
    "size" REAL,
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("categoryId", "createdAt", "duration", "filename", "id", "isCompleted", "isFavourite", "path", "resolution", "size", "thumbnailPath") SELECT "categoryId", "createdAt", "duration", "filename", "id", "isCompleted", "isFavourite", "path", "resolution", "size", "thumbnailPath" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
