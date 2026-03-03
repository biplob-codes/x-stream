import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import config from "@/config";

const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv"];

export async function GET() {
  try {
    const files = fs.readdirSync(config.inboxFolder);

    const videos = files
      .filter((file) =>
        VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase()),
      )
      .map((file) => ({
        filename: file,
        path: path.join(config.inboxFolder, file),
      }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Failed to read inbox folder:", error);
    return NextResponse.json(
      { error: "Failed to read inbox folder" },
      { status: 500 },
    );
  }
}
