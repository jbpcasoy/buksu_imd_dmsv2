import { QAMISDeanEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useQAMISDeanEndorsements({
  skip,
  take,
  filter,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    qAMISDeanEndorsements: QAMISDeanEndorsement[];
    count: number;
  }>({
    count: 0,
    qAMISDeanEndorsements: [],
  });

  useEffect(() => {
    axios
      .get("/api/qamis_dean_endorsement", {
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
