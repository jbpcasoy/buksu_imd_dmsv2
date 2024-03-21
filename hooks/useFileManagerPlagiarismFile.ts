import { ListBlobResultBlob } from "@vercel/blob";
import axios from "axios";
import { useEffect, useState } from "react";

interface UseFileManagerPlagiarismFileProps {
  filename?: string;
}

export default function useFileManagerPlagiarismFile({
  filename,
}: UseFileManagerPlagiarismFileProps) {
  const [state, setState] = useState<ListBlobResultBlob | null>();

  useEffect(() => {
    if (!filename) {
      return;
    }

    axios
      .get(`/api/file_manager/plagiarism/${filename}`)
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
