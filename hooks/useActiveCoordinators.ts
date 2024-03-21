import { ActiveCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useActiveCoordinators({
  skip,
  take,
  filter,
}: useCoordinatorsParams) {
  const [state, setState] = useState<{
    activeCoordinators: ActiveCoordinator[];
    count: number;
  }>({
    count: 0,
    activeCoordinators: [],
  });

  useEffect(() => {
    axios
      .get("/api/active_coordinator", {
        params: {
          skip,
          take,
          filter,
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
