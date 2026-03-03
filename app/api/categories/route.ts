import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const folderPath = `${name.trim()}`;

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        folderPath,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 },
      );
    }
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
