import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import config from "@/config";
import { addToQueue } from "@/app/lib/thumbnailQueue";

export async function POST(request: NextRequest) {
  try {
    const { filename, newFilename, categoryId, tagIds } = await request.json();

    if (!filename || !categoryId || !tagIds || tagIds.length === 0) {
      return NextResponse.json(
        { error: "filename, categoryId and at least one tag are required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const finalFilename = newFilename?.trim() || filename;
    const sourcePath = path.join(config.inboxFolder, filename);
    const destDir = path.join(config.libraryFolder, category.name);
    const destPath = path.join(destDir, finalFilename);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const video = await prisma.video.create({
      data: {
        filename: finalFilename,
        path: destPath,
        categoryId,
        videoTags: {
          create: tagIds.map((tagId: string) => ({ tagId })),
        },
      },
    });

    fs.renameSync(sourcePath, destPath);
    addToQueue(video.id, destPath);

    return NextResponse.json({ video }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to move video:", error);
    return NextResponse.json(
      { error: "Failed to move video" },
      { status: 500 },
    );
  }
}
