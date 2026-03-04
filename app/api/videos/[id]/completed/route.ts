import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const updated = await prisma.video.update({
      where: { id },
      data: { isCompleted: !video.isCompleted },
    });

    return NextResponse.json({ isCompleted: updated.isCompleted });
  } catch (error) {
    console.error("Failed to toggle completed:", error);
    return NextResponse.json(
      { error: "Failed to toggle completed" },
      { status: 500 },
    );
  }
}
