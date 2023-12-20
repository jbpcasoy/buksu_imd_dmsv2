import { useEffect, useState } from "react";
import { ReturnedDepartmentRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedDepartmentRevisionMeParams {
  id: string;
}
export default function useReturnedDepartmentRevisionMe({ id }: useReturnedDepartmentRevisionMeParams, refreshFlag?: number) {
  const [state, setState] = useState<ReturnedDepartmentRevision | null>();

  useEffect(() => {
    console.log({id})
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_department_revision/im/${id}/me`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        if (!subscribe) return;
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id, refreshFlag]);

  return state;
}
