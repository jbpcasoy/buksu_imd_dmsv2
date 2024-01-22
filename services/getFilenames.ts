import path from "path";
import fs from "fs";

export default function getFilenames(folderPath: string) {
  // Get the full path of the folder
  const fullPath = path.join(process.cwd(), folderPath);

  // Read the contents of the folder
  const filenames = fs.readdirSync(fullPath);

  return filenames;
}