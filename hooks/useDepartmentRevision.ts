import { useEffect, useState } from "react";
import { DepartmentRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useDepartmentRevisionParams {
  id: string;
}
export default function useDepartmentRevision({ id }: useDepartmentRevisionParams) {
  const [state, setState] = useState<DepartmentRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/department_revision/${id}`)
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
