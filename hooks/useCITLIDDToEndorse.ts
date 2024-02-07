import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCITLIDDToEndorseParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}

export default function useCITLIDDToEndorse({
  skip,
  take,
  filter,
  sort,
}: useCITLIDDToEndorseParams) {
  const [state, setState] = useState<{ iMs: IM[]; count: number }>({
    count: 0,
    iMs: [],
  });

  useEffect(() => {
    axios
      .get("/api/im/citl/to_endorse", {
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
