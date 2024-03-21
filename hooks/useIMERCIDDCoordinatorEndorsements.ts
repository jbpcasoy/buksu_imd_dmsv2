import { IMERCIDDCoordinatorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIMERCIDDCoordinatorEndorsements({
  skip,
  take,
  filter,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    iMERCIDDCoordinatorEndorsements: IMERCIDDCoordinatorEndorsement[];
    count: number;
  }>({
    count: 0,
    iMERCIDDCoordinatorEndorsements: [],
  });

  useEffect(() => {
    axios
      .get("/api/imerc_idd_coordinator_endorsement", {
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
