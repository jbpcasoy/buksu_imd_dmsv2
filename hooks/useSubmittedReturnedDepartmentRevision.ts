import { SubmittedReturnedDepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedDepartmentRevisionParams {
  id: string;
}
export default function useSubmittedReturnedDepartmentRevision({
  id,
}: useSubmittedReturnedDepartmentRevisionParams) {
  const [state, setState] =
    useState<SubmittedReturnedDepartmentRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_returned_department_revision/${id}`)
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
