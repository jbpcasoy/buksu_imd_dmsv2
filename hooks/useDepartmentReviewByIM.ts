import { useEffect, useState } from "react";
import { DepartmentReview, IM } from "@prisma/client";
import axios from "axios";

export interface useDepartmentReviewByIMParams {
  id: string;
}
export default function useDepartmentReviewByIM({ id }: useDepartmentReviewByIMParams) {
  const [state, setState] = useState<DepartmentReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/department_review/im/${id}`)
      .then((res) => {
        if(!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
