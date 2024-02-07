import { useEffect, useState } from "react";
import { DepartmentReviewed, IM } from "@prisma/client";
import axios from "axios";

export interface useDepartmentReviewedIMParams {
  id: string;
}
export default function useDepartmentReviewedIM({ id }: useDepartmentReviewedIMParams) {
  const [state, setState] = useState<DepartmentReviewed | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/department_reviewed/im/${id}`)
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
