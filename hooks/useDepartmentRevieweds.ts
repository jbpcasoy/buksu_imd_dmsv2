import { DepartmentReviewed } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDepartmentReviewedsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useDepartmentRevieweds({
  skip,
  take,
  filter,
}: useDepartmentReviewedsParams) {
  const [state, setState] = useState<{
    departmentRevieweds: DepartmentReviewed[];
    count: number;
  }>({
    count: 0,
    departmentRevieweds: [],
  });

  useEffect(() => {
    axios
      .get("/api/department_reviewed", {
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
