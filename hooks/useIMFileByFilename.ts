import { IMFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMFileByFilenameParams {
  filename?: string;
}
export default function useIMFileByFilename({
  filename,
}: useIMFileByFilenameParams) {
  const [state, setState] = useState<IMFile | null>();

  useEffect(() => {
    if (!filename) return;

    let subscribe = true;

    axios
      .get(`/api/im_file/by_filename/${filename}`)
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
