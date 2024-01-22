import FileMetadata from "@/constants/FileMetadata";
import prisma from "@/prisma/client";
import fs from "fs";
import path from "path";

export default async function getFilesWithMetadata(
  folderPath: string,
  take: number = Infinity,
  skip: number = 0
): Promise<FileMetadata[]> {
  const fullPath = path.join(process.cwd(), folderPath);

  try {
    const filenames = await fs.promises.readdir(fullPath);

    // Apply pagination
    let paginatedFilenames = filenames.slice(skip, skip + take);

    // Get metadata for each file
    const filesWithMetadata = await Promise.all(
      paginatedFilenames.map(async (filename) => {
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

    return filesWithMetadata;
  } catch (error) {
    console.error("Error reading folder:", error);
    return [];
  }
}
