import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCITLDirectorEndorsedParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCITLDirectorEndorsed({
  skip,
  take,
  filter,
}: useCITLDirectorEndorsedParams) {
  const [state, setState] = useState<{ iMs: IM[]; count: number }>({
    count: 0,
    iMs: [],
  });

  useEffect(() => {
    axios
      .get("/api/im/citl/citl_director_endorsed", {
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
