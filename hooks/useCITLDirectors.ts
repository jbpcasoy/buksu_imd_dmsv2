import { CITLDirector } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCITLDirectorsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCITLDirectors({ skip, take, filter }: useCITLDirectorsParams) {
  const [state, setState] = useState<{cITLDirectors: CITLDirector[], count: number}>({
    count: 0,
    cITLDirectors: []
  });

  useEffect(() => {
    axios
      .get("/api/citl_director", {
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
