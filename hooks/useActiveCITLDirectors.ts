import { ActiveCITLDirector } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCITLDirectorsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useActiveCITLDirectors({ skip, take, filter }: useCITLDirectorsParams) {
  const [state, setState] = useState<{activeCITLDirectors: ActiveCITLDirector[], count: number}>({
    count: 0,
    activeCITLDirectors: []
  });

  useEffect(() => {
    axios
      .get("/api/active_citl_director", {
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
