import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import config from "@/config";

export async function POST(request: NextRequest) {
  try {
    const { filename, categoryId, tagIds } = await request.json();

    if (!filename || !categoryId || !tagIds || tagIds.length === 0) {
      return NextResponse.json(
        { error: "filename, categoryId and at least one tag are required" },
        { status: 400 },
      );
    }

    // get category to find destination folder name
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const sourcePath = path.join(config.inboxFolder, filename);
    const destDir = path.join(config.libraryFolder, category.name);
    const destPath = path.join(destDir, filename);

    // create the category subfolder if it doesn't exist yet
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // write to DB first
    const video = await prisma.video.create({
      data: {
        filename,
        path: destPath,
        categoryId,
        videoTags: {
          create: tagIds.map((tagId: string) => ({ tagId })),
        },
      },
    });

    // then move the file
    fs.renameSync(sourcePath, destPath);

    return NextResponse.json({ video }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to move video:", error);
    return NextResponse.json(
      { error: "Failed to move video" },
      { status: 500 },
    );
  }
}
