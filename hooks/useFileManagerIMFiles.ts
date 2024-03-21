import { ListBlobResultBlob } from "@vercel/blob";
import axios from "axios";
import { useEffect, useState } from "react";

interface UseFileManagerIMFilesProps {
  take: number;
  filter?: object;
  cursor?: string;
}

export default function useFileManagerIMFiles({
  take,
  filter,
  cursor,
}: UseFileManagerIMFilesProps) {
  const [state, setState] = useState<{
    fileMetadatas: ListBlobResultBlob[];
    count: number;
    cursor?: string;
    hasMore?: boolean;
  }>({
    count: 0,
    fileMetadatas: [],
  });

  useEffect(() => {
    axios
      .get("/api/file_manager/im", {
        params: {
          take,
          filter,
          cursor,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [take, filter, cursor]);

  return state;
}
