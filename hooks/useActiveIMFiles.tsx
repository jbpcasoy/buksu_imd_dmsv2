import { ActiveIMFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useActiveIMFilesParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useActiveIMFiles({ skip, take, filter }: useActiveIMFilesParams) {
  const [state, setState] = useState<{activeIMFiles: ActiveIMFile[], count: number}>({
    count: 0,
    activeIMFiles: []
  });

  useEffect(() => {
    axios
      .get("/api/active_im_file", {
        params: {
          skip,
          take,
          filter
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
