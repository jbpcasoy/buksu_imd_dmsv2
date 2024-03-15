import { SubmittedReturnedDepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedDepartmentRevisionIMParams {
  id: string;
}
export default function useSubmittedReturnedDepartmentRevisionIM({
  id,
}: useSubmittedReturnedDepartmentRevisionIMParams) {
  const [state, setState] =
    useState<SubmittedReturnedDepartmentRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_returned_department_revision/im/${id}`)
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
