import FileMetadata from "@/constants/FileMetadata";
import axios from "axios";
import { useEffect, useState } from "react";

interface UseFileManagerIMFilesProps {
  skip: number;
  take: number;
  filter?: object;
}

export default function useFileManagerIMFiles({
  skip,
  take,
  filter,
}: UseFileManagerIMFilesProps) {
  const [state, setState] = useState<{
    fileMetadatas: FileMetadata[];
    count: number;
  }>({
    count: 0,
    fileMetadatas: [],
  });

  useEffect(() => {
    axios
      .get("/api/file_manager/im", {
        params: {
          skip,
          take,
          filter,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter]);

  return state;
}
