import { PlagiarismFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePlagiarismFileByFilenameParams {
  filename?: string;
}
export default function usePlagiarismFileByFilename({
  filename,
}: usePlagiarismFileByFilenameParams) {
  const [state, setState] = useState<PlagiarismFile | null>();

  useEffect(() => {
    if (!filename) return;

    let subscribe = true;

    axios
      .get(`/api/plagiarism_file/by_filename/${filename}`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [filename]);

  return state;
}
