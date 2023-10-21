import { useEffect, useState } from "react";
import { DepartmentRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useDepartmentRevisionIMParams {
  id?: string;
}
export default function useDepartmentRevisionIM({
  id,
}: useDepartmentRevisionIMParams) {
  const [state, setState] = useState<DepartmentRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/department_revision/im/${id}`)
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
