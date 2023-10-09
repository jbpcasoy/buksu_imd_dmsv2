import { Dean } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useDeans({ skip, take, filter }: useFacultiesParams) {
  const [state, setState] = useState<{deans: Dean[], count: number}>({
    count: 0,
    deans: []
  });

  useEffect(() => {
    axios
      .get("/api/dean", {
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
