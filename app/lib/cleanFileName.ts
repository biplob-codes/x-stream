export function cleanFilename(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf("."));
  let name = filename.slice(0, filename.lastIndexOf("."));

  // remove site prefixes e.g. "EPORNER.COM - ", "xvideos.com - "
  name = name.replace(/^[\w.-]+\.(com|net|org|tv|xxx)\s*[-–]\s*/gi, "");

  // remove ID brackets e.g. [8k7FDgJofpp]
  name = name.replace(/\[[^\]]*\]/g, "");
  name = name.replace(/\([a-zA-Z0-9_-]{4,}\)/g, "");

  // remove episode markers e.g. S3E2, S01E02, s3e2
  name = name.replace(/[_\s-]*[Ss]\d{1,2}[Ee]\d{1,2}[_\s-]*/g, " ");

  // remove dates e.g. 07_09_2023, 2023-07-09, 07-09-2023
  name = name.replace(/[_\s-]*\d{2}[_-]\d{2}[_-]\d{4}[_\s-]*/g, " ");
  name = name.replace(/[_\s-]*\d{4}[_-]\d{2}[_-]\d{2}[_\s-]*/g, " ");

  // remove quality indicators e.g. 1080p, 720p, 4k, 8k, 1920, 1280, UHD
  name = name.replace(/[_\s-]*\b(4k|8k|uhd|fhd|hd)\b[_\s-]*/gi, " ");
  name = name.replace(/[_\s-]*\(?\b\d{3,4}p?\b\)?[_\s-]*/g, " ");

  // replace underscores and hyphens with spaces
  name = name.replace(/[_-]/g, " ");

  // remove leftover brackets and parens
  name = name.replace(/[\[\]\(\)]/g, "");

  // clean up multiple spaces
  name = name.replace(/\s+/g, " ").trim();

  // title case
  name = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return name + ext;
}
export function removeExtension(filename: string): string {
  return filename.slice(0, filename.lastIndexOf("."));
}
