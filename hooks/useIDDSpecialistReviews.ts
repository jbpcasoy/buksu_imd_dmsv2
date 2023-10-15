import { IDDSpecialistReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDSpecialistReviewsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useIDDSpecialistReviews({ skip, take, filter }: useIDDSpecialistReviewsParams) {
  const [state, setState] = useState<{iDDSpecialistReviews: IDDSpecialistReview[], count: number}>({
    count: 0,
    iDDSpecialistReviews: []
  });

  useEffect(() => {
    axios
      .get("/api/idd_specialist_review", {
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
