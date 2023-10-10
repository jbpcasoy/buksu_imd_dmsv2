import { DepartmentReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDepartmentReviewsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useDepartmentReviews({ skip, take, filter }: useDepartmentReviewsParams) {
  const [state, setState] = useState<{departmentReviews: DepartmentReview[], count: number}>({
    count: 0,
    departmentReviews: []
  });

  useEffect(() => {
    axios
      .get("/api/department_review", {
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
