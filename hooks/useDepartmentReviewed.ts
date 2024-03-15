import { DepartmentReviewed } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDepartmentReviewedParams {
  id: string;
}
export default function useDepartmentReviewed({
  id,
}: useDepartmentReviewedParams) {
  const [state, setState] = useState<DepartmentReviewed | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/department_reviewed/${id}`)
      .then((res) => {
        if (!subscribe) return;
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
