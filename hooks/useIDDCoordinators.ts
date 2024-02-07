import { IDDCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorsParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useIDDCoordinators({
  skip,
  take,
  filter,
  sort,
}: useIDDCoordinatorsParams) {
  const [state, setState] = useState<{
    iDDCoordinators: IDDCoordinator[];
    count: number;
  }>({
    count: 0,
    iDDCoordinators: [],
  });

  useEffect(() => {
    axios
      .get("/api/idd_coordinator", {
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
