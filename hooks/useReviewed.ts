import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReviewedParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useReviewed({ skip, take, filter }: useReviewedParams) {
  const [state, setState] = useState<{iMs: IM[], count: number}>({
    count: 0,
    iMs: []
  });

  useEffect(() => {
    axios
      .get("/api/im/department/reviewed", {
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
