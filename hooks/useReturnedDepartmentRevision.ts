import { useEffect, useState } from "react";
import { ReturnedDepartmentRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedDepartmentRevisionParams {
  id?: string;
}
export default function useReturnedDepartmentRevision({ id }: useReturnedDepartmentRevisionParams) {
  const [state, setState] = useState<ReturnedDepartmentRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_department_revision/${id}`)
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
