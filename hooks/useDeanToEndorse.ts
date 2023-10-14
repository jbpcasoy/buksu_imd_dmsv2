import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDeanToEndorseParams {
  skip: number;
  take: number;
}
export default function useDeanToEndorse({ skip, take }: useDeanToEndorseParams) {
  const [state, setState] = useState<{iMs: IM[], count: number}>({
    count: 0,
    iMs: []
  });

  useEffect(() => {
    axios
      .get("/api/im/college/to_endorse", {
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
