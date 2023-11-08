import { ReturnedDepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedDepartmentRevisionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useReturnedDepartmentRevisions({ skip, take, filter }: useReturnedDepartmentRevisionsParams) {
  const [state, setState] = useState<{returnedDepartmentRevisions: ReturnedDepartmentRevision[], count: number}>({
    count: 0,
    returnedDepartmentRevisions: []
  });

  useEffect(() => {
    axios
      .get("/api/returned_department_revision", {
        params: {
          skip,
          take,
          filter
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
