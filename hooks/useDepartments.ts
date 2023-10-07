import { Department } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDepartmentsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useDepartments({
  skip,
  take,
  filter,
}: useDepartmentsParams) {
  const [state, setState] = useState<{
    departments: Department[];
    count: number;
  }>({
    count: 0,
    departments: [],
  });

  useEffect(() => {
    axios
      .get("/api/department", {
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
