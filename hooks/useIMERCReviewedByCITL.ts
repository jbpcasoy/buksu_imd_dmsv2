import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCReviewedByCITLParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIMERCReviewedByCITL({
  skip,
  take,
  filter,
}: useIMERCReviewedByCITLParams) {
  const [state, setState] = useState<{ iMs: IM[]; count: number }>({
    count: 0,
    iMs: [],
  });

  useEffect(() => {
    axios
      .get("/api/im/imerc/citl/reviewed", {
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
