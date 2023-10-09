import { Chairperson } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useChairpersons({ skip, take, filter }: useFacultiesParams) {
  const [state, setState] = useState<{chairpersons: Chairperson[], count: number}>({
    count: 0,
    chairpersons: []
  });

  useEffect(() => {
    axios
      .get("/api/chairperson", {
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
