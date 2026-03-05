import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import trash from "trash";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // move to recycle bin — don't delete DB record or thumbnail
    await trash(video.path);

    await prisma.video.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to trash video:", error);
    return NextResponse.json(
      { error: "Failed to trash video" },
      { status: 500 },
    );
  }
}
