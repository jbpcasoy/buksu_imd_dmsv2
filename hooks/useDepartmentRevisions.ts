import { DepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDepartmentRevisionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useDepartmentRevisions({
  skip,
  take,
  filter,
}: useDepartmentRevisionsParams) {
  const [state, setState] = useState<{
    departmentRevisions: DepartmentRevision[];
    count: number;
  }>({
    count: 0,
    departmentRevisions: [],
  });

  useEffect(() => {
    axios
      .get("/api/department_revision", {
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
