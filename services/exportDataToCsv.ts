import * as csv from "fast-csv";
import { flatten } from "flat";
import fs from "fs";

const exportDataToCSV = async ({
  data,
  destination,
}: {
  data: Object[];
  destination: string;
}) => {
  if (data.length === 0) {
    throw new Error("No Data to export");
  }

  // Flatten the object data
  const flattenedData = data.map((item) => flatten(item));

  // Create a write stream for the CSV file
  const csvStream = fs.createWriteStream(destination);

  return new Promise((resolve, reject) => {
    // Create a CSV writer using fast-csv
    const csvWriter = csv.format({ headers: true });

    // Pipe the CSV data to the file
    csvWriter.pipe(csvStream);

    // Write the flattened data to the CSV file
    flattenedData.forEach((item) => {
      csvWriter.write(item);
    });

    // Close the CSV writer and stream
    csvWriter.end();
    csvStream.on("finish", () => {
      resolve(destination);
    });
    csvWriter.on("error", reject);
    csvStream.on("error", reject);
  });
};

export default exportDataToCSV;
