import { ContentSpecialistReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistReviewsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useContentSpecialistReviews({
  skip,
  take,
  filter,
}: useContentSpecialistReviewsParams) {
  const [state, setState] = useState<{
    contentSpecialistReviews: ContentSpecialistReview[];
    count: number;
  }>({
    count: 0,
    contentSpecialistReviews: [],
  });

  useEffect(() => {
    axios
      .get("/api/content_specialist_review", {
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
