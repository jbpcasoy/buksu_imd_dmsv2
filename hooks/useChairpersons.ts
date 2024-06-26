import { Chairperson } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useChairpersons({
  skip,
  take,
  filter,
  sort,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    chairpersons: Chairperson[];
    count: number;
  }>({
    count: 0,
    chairpersons: [],
  });

  useEffect(() => {
    axios
      .get("/api/chairperson", {
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
