import FileMetadata from "@/constants/FileMetadata";
import axios from "axios";
import { useEffect, useState } from "react";

interface UseFileManagerQAMISFileProps {
  filename?: string;
}

export default function useFileManagerQAMISFile({
  filename,
}: UseFileManagerQAMISFileProps) {
  const [state, setState] = useState<FileMetadata | null>();

  useEffect(() => {
    if (!filename) {
      return;
    }

    axios
      .get(`/api/file_manager/qamis/${filename}`)
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
