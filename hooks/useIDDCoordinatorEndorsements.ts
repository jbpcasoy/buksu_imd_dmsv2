import { IDDCoordinatorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIDDCoordinatorEndorsements({ skip, take, filter }: useFacultiesParams) {
  const [state, setState] = useState<{iDDCoordinatorEndorsements: IDDCoordinatorEndorsement[], count: number}>({
    count: 0,
    iDDCoordinatorEndorsements: []
  });

  useEffect(() => {
    axios
      .get("/api/idd_coordinator_endorsement", {
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
