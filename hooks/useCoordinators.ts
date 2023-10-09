import { Coordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCoordinators({ skip, take, filter }: useFacultiesParams) {
  const [state, setState] = useState<{coordinators: Coordinator[], count: number}>({
    count: 0,
    coordinators: []
  });

  useEffect(() => {
    axios
      .get("/api/coordinator", {
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
