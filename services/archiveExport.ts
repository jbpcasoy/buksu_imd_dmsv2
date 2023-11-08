// require modules
import fs from "fs";
import archiver from "archiver";
import path from "path";
import logger from "./logger";

// create a file to stream archive data to.
export default async function archiveExport() {
  return new Promise((resolve, reject) => {
    const destination = path.join(process.cwd(), `/files/export`);
    const output = fs.createWriteStream(path.join(process.cwd(), `/export.zip`));
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on("close", function () {
      logger.info(archive.pointer() + " total bytes");
      logger.info(
        "archiver has been finalized and the output file descriptor has closed."
      );

      resolve(destination);
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on("end", function () {
      logger.info("Data has been drained");
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on("warning", function (err: any) {
      if (err.code === "ENOENT") {
        // log warning
      } else {
        // throw error
        reject(err);
      }
    });

    // good practice to catch this error explicitly
    archive.on("error", function (err: any) {
      reject(err);
    });

    // pipe archive data to the file
    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(destination, false);

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
  });
}
