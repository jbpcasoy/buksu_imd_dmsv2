import { CoordinatorReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorReviewsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCoordinatorReviews({
  skip,
  take,
  filter,
}: useCoordinatorReviewsParams) {
  const [state, setState] = useState<{
    coordinatorReviews: CoordinatorReview[];
    count: number;
  }>({
    count: 0,
    coordinatorReviews: [],
  });

  useEffect(() => {
    axios
      .get("/api/coordinator_review", {
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
