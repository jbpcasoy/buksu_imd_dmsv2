import { CITLDirector } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCITLDirectorsParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useCITLDirectors({
  skip,
  take,
  filter,
  sort,
}: useCITLDirectorsParams) {
  const [state, setState] = useState<{
    cITLDirectors: CITLDirector[];
    count: number;
  }>({
    count: 0,
    cITLDirectors: [],
  });

  useEffect(() => {
    axios
      .get("/api/citl_director", {
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
