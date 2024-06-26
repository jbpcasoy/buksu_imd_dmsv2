import { IMFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMFilesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIMFiles({ skip, take, filter }: useIMFilesParams) {
  const [state, setState] = useState<{ iMFiles: IMFile[]; count: number }>({
    count: 0,
    iMFiles: [],
  });

  useEffect(() => {
    axios
      .get("/api/im_file", {
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
