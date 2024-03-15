import { QAMISCoordinatorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useQAMISCoordinatorEndorsements({
  skip,
  take,
  filter,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    qAMISCoordinatorEndorsements: QAMISCoordinatorEndorsement[];
    count: number;
  }>({
    count: 0,
    qAMISCoordinatorEndorsements: [],
  });

  useEffect(() => {
    axios
      .get("/api/qamis_coordinator_endorsement", {
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
