import { ActiveIDDCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useActiveIDDCoordinators({ skip, take, filter }: useIDDCoordinatorsParams) {
  const [state, setState] = useState<{activeIDDCoordinators: ActiveIDDCoordinator[], count: number}>({
    count: 0,
    activeIDDCoordinators: []
  });

  useEffect(() => {
    axios
      .get("/api/active_idd_coordinator", {
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
