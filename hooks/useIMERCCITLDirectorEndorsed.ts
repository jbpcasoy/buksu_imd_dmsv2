import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCCITLDirectorEndorsedParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useIMERCCITLDirectorEndorsed({
  skip,
  take,
  filter,
  sort,
}: useIMERCCITLDirectorEndorsedParams) {
  const [state, setState] = useState<{ iMs: IM[]; count: number }>({
    count: 0,
    iMs: [],
  });

  useEffect(() => {
    axios
      .get("/api/im/imerc/citl/citl_director_endorsed", {
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
