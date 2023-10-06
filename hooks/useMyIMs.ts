import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useMyIMsParams {
  skip: number;
  take: number;
}
export default function useMyIMs({ skip, take }: useMyIMsParams) {
  const [state, setState] = useState<{iMs: IM[], count: number}>({
    count: 0,
    iMs: []
  });

  useEffect(() => {
    axios
      .get("/api/im/my_ims", {
        params: {
          skip,
          take,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take]);

  return state;
}
