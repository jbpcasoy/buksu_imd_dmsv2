import { Department } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDepartmentsParams {
  skip: number;
  take: number;
}
export default function useDepartments({ skip, take }: useDepartmentsParams) {
  const [state, setState] = useState<{departments: Department[], count: number}>({
    count: 0,
    departments: []
  });

  useEffect(() => {
    axios
      .get("/api/department", {
        params: {
          skip,
          take,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take]);

  return state;
}
