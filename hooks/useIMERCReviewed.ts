import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCReviewedParams {
  skip: number;
  take: number;
}
export default function useIMERCReviewed({ skip, take }: useIMERCReviewedParams) {
  const [state, setState] = useState<{iMs: IM[], count: number}>({
    count: 0,
    iMs: []
  });

  useEffect(() => {
    axios
      .get("/api/im/imerc/department/reviewed", {
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
