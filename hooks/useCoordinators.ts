import { Coordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useCoordinators({
  skip,
  take,
  filter,
  sort,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    coordinators: Coordinator[];
    count: number;
  }>({
    count: 0,
    coordinators: [],
  });

  useEffect(() => {
    axios
      .get("/api/coordinator", {
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
