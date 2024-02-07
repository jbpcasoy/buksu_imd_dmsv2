import { QAMISFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISFileByFilenameParams {
  filename?: string;
}
export default function useQAMISFileByFilename({
  filename,
}: useQAMISFileByFilenameParams) {
  const [state, setState] = useState<QAMISFile | null>();

  useEffect(() => {
    if (!filename) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_file/by_filename/${filename}`)
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
