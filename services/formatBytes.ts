export default function formatBytes(
  size: number,
  decimalPlaces: number = 2
): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];

  for (let i = 0; i < units.length; i++) {
    if (size < 1000) {
      return `${size.toFixed(decimalPlaces)} ${units[i]}`;
    }
    size /= 1000;
  }

  // If size is extremely large, return the size in PB
  return `${size.toFixed(decimalPlaces)} ${units[units.length - 1]}`;
}
