import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { prisma } from "./prisma";

interface QueueJob {
  videoId: string;
  videoPath: string;
}

const queue: QueueJob[] = [];
let isProcessing = false;

const THUMBNAIL_DIR = path.join(process.cwd(), "public", "thumbnails");

// make sure thumbnail dir exists
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

export function addToQueue(videoId: string, videoPath: string) {
  queue.push({ videoId, videoPath });
  if (!isProcessing) processNext();
}

async function processNext() {
  if (queue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const job = queue.shift()!;

  try {
    await processVideo(job);
  } catch (err) {
    console.error(`Failed to process video ${job.videoId}:`, err);
  }

  processNext();
}

async function processVideo({ videoId, videoPath }: QueueJob): Promise<void> {
  return new Promise((resolve, reject) => {
    // first get metadata via ffprobe
    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find(
        (s) => s.codec_type === "video",
      );
      const duration = metadata.format.duration || 0;
      const size = metadata.format.size || 0;
      const resolution = videoStream
        ? `${videoStream.width}x${videoStream.height}`
        : null;

      // seek to 75% of duration for thumbnail
      const seekTime = duration * 0.75;
      const thumbnailPath = path.join(THUMBNAIL_DIR, `${videoId}.jpg`);
      const thumbnailUrl = `/thumbnails/${videoId}.jpg`;

      ffmpeg(videoPath)
        .seekInput(seekTime)
        .frames(1)
        .output(thumbnailPath)
        .on("end", async () => {
          try {
            await prisma.video.update({
              where: { id: videoId },
              data: {
                thumbnailPath: thumbnailUrl,
                duration,
                size,
                resolution,
              },
            });
            console.log(`✓ Processed: ${videoId}`);
            resolve();
          } catch (dbErr) {
            reject(dbErr);
          }
        })
        .on("error", reject)
        .run();
    });
  });
}
