import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorEndorsedParams {
  skip: number;
  take: number;
}
export default function useCoordinatorEndorsed({ skip, take }: useCoordinatorEndorsedParams) {
  const [state, setState] = useState<{iMs: IM[], count: number}>({
    count: 0,
    iMs: []
  });

  useEffect(() => {
    axios
      .get("/api/im/department/endorsed", {
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
