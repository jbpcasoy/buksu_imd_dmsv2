import { SubmittedReturnedDepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedDepartmentRevisionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSubmittedReturnedDepartmentRevisions({
  skip,
  take,
  filter,
}: useSubmittedReturnedDepartmentRevisionsParams) {
  const [state, setState] = useState<{
    submittedReturnedDepartmentRevisions: SubmittedReturnedDepartmentRevision[];
    count: number;
  }>({
    count: 0,
    submittedReturnedDepartmentRevisions: [],
  });

  useEffect(() => {
    axios
      .get("/api/submitted_returned_department_revision", {
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
