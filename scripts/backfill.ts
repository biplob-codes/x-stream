import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { prisma } from "../app/lib/prisma";

const THUMBNAIL_DIR = path.join(process.cwd(), "public", "thumbnails");

if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

async function processVideo(videoId: string, videoPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) {
        console.error(`ffprobe failed for ${videoPath}:`, err);
        return resolve(); // skip and continue
      }

      const videoStream = metadata.streams.find(
        (s) => s.codec_type === "video",
      );
      const duration = metadata.format.duration || 0;
      const size = metadata.format.size || 0;
      const resolution = videoStream
        ? `${videoStream.width}x${videoStream.height}`
        : null;

      const seekTime = duration * 0.45;
      const thumbnailPath = path.join(THUMBNAIL_DIR, `${videoId}.jpg`);
      const thumbnailUrl = `/thumbnails/${videoId}.jpg`;

      ffmpeg(videoPath)
        .seekInput(seekTime)
        .frames(1)
        .output(thumbnailPath)
        .on("end", async () => {
          await prisma.video.update({
            where: { id: videoId },
            data: {
              thumbnailPath: thumbnailUrl,
              duration,
              size,
              resolution,
            },
          });
          console.log(`✓ ${videoId}`);
          resolve();
        })
        .on("error", (e) => {
          console.error(`ffmpeg failed for ${videoPath}:`, e);
          resolve(); // skip and continue
        })
        .run();
    });
  });
}

async function backfill() {
  const videos = await prisma.video.findMany({
    where: {
      OR: [
        { thumbnailPath: null },
        { duration: null },
        { resolution: null },
        { size: null },
      ],
    },
  });

  console.log(`Found ${videos.length} videos to backfill...`);

  for (const video of videos) {
    if (!fs.existsSync(video.path)) {
      console.warn(`File not found, skipping: ${video.path}`);
      continue;
    }
    await processVideo(video.id, video.path);
  }

  console.log("Backfill complete.");
  await prisma.$disconnect();
}

backfill();
