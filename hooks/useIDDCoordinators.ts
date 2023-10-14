import { IDDCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIDDCoordinators({ skip, take, filter }: useIDDCoordinatorsParams) {
  const [state, setState] = useState<{iDDCoordinators: IDDCoordinator[], count: number}>({
    count: 0,
    iDDCoordinators: []
  });

  useEffect(() => {
    axios
      .get("/api/idd_coordinator", {
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
