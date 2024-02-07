import { Department } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDepartmentsParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useDepartments({
  skip,
  take,
  filter,
  sort,
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
          filter,
          sort,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter, sort]);

  return state;
}
