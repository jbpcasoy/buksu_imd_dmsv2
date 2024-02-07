import FileMetadata from "@/constants/FileMetadata";
import fs from "fs";
import path from "path";

export default async function getFileWithMetadata(
  folderPath: string,
  filenameQuery: string | RegExp
): Promise<FileMetadata | null> {
  const fullPath = path.join(process.cwd(), folderPath);

  const filenames = await fs.promises.readdir(fullPath);

  // Apply filename query
  const filteredFilenames = filenames.filter((filename) =>
    typeof filenameQuery === "string"
      ? filename.includes(filenameQuery)
      : filenameQuery.test(filename)
  );

  // Get metadata for each file
  const filesWithMetadata = await Promise.all(
    filteredFilenames.map(async (filename) => {
      const filePath = path.join(fullPath, filename);
      const stats = await fs.promises.stat(filePath);

      return {
        filename,
        metadata: {
          size: stats.size,
          lastModified: stats.mtime,
        },
      };
    })
  );

  return filesWithMetadata[0];
}
