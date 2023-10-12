import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useToReviewParams {
  skip: number;
  take: number;
}
export default function useToReview({ skip, take }: useToReviewParams) {
  const [state, setState] = useState<{iMs: IM[], count: number}>({
    count: 0,
    iMs: []
  });

  useEffect(() => {
    axios
      .get("/api/im/department/to_review", {
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
