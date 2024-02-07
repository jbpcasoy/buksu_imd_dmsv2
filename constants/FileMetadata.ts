export default interface FileMetadata {
  filename: string;
  metadata: {
    size: number;
    lastModified: Date;
  };
}
