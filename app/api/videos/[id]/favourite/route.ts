import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

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
      data: { isFavourite: !video.isFavourite },
    });

    return NextResponse.json({ isFavourite: updated.isFavourite });
  } catch (error) {
    console.error("Failed to toggle favourite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favourite" },
      { status: 500 },
    );
  }
}
