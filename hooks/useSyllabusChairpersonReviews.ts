import { SyllabusChairpersonReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSyllabusChairpersonReviewsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSyllabusChairpersonReviews({
  skip,
  take,
  filter,
}: useSyllabusChairpersonReviewsParams) {
  const [state, setState] = useState<{
    syllabusChairpersonReviews: SyllabusChairpersonReview[];
    count: number;
  }>({
    count: 0,
    syllabusChairpersonReviews: [],
  });

  useEffect(() => {
    axios
      .get("/api/syllabus_chairperson_review", {
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
