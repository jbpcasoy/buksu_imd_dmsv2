import { ChairpersonReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonReviewsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useChairpersonReviews({
  skip,
  take,
  filter,
}: useChairpersonReviewsParams) {
  const [state, setState] = useState<{
    chairpersonReviews: ChairpersonReview[];
    count: number;
  }>({
    count: 0,
    chairpersonReviews: [],
  });

  useEffect(() => {
    axios
      .get("/api/chairperson_review", {
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
