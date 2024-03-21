import { CITLDirectorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCITLDirectorEndorsements({
  skip,
  take,
  filter,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    cITLDirectorEndorsements: CITLDirectorEndorsement[];
    count: number;
  }>({
    count: 0,
    cITLDirectorEndorsements: [],
  });

  useEffect(() => {
    axios
      .get("/api/citl_director_endorsement", {
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
