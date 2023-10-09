import { ActiveDean } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDeansParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useActiveDeans({ skip, take, filter }: useDeansParams) {
  const [state, setState] = useState<{activeDeans: ActiveDean[], count: number}>({
    count: 0,
    activeDeans: []
  });

  useEffect(() => {
    axios
      .get("/api/active_dean", {
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
