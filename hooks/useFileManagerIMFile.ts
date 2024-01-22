import FileMetadata from "@/constants/FileMetadata";
import axios from "axios";
import { useEffect, useState } from "react";

interface UseFileManagerIMFileProps {
  filename?: string;
}

export default function useFileManagerIMFile({
  filename,
}: UseFileManagerIMFileProps) {
  const [state, setState] = useState<FileMetadata | null>();

  useEffect(() => {
    if (!filename) {
      return;
    }

    axios
      .get(`/api/file_manager/im/${filename}`)
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        setState(null);
        console.error(error);
      });
  }, [filename]);

  return state;
}