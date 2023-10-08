import { Faculty } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useFaculties({ skip, take, filter }: useFacultiesParams) {
  const [state, setState] = useState<{faculties: Faculty[], count: number}>({
    count: 0,
    faculties: []
  });

  useEffect(() => {
    axios
      .get("/api/faculty", {
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