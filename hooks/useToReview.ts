import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useToReviewParams {
  skip: number;
  take: number;
  filter: object;
}
export default function useToReview({ skip, take, filter }: useToReviewParams) {
  const [state, setState] = useState<{ iMs: IM[]; count: number }>({
    count: 0,
    iMs: [],
  });

  useEffect(() => {
    axios
      .get("/api/im/department/to_review", {
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
