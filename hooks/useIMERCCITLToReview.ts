import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCCITLToReviewParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}

export default function useIMERCCITLToReview({
  skip,
  take,
  filter,
  sort,
}: useIMERCCITLToReviewParams) {
  const [state, setState] = useState<{ iMs: IM[]; count: number }>({
    count: 0,
    iMs: [],
  });

  useEffect(() => {
    axios
      .get("/api/im/imerc/citl/to_review", {
        params: {
          skip,
          take,
          filter,
          sort,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter, sort]);

  return state;
}
