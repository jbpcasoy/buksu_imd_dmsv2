import { IMERCCITLDirectorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIMERCCITLDirectorEndorsements({
  skip,
  take,
  filter,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    iMERCCITLDirectorEndorsements: IMERCCITLDirectorEndorsement[];
    count: number;
  }>({
    count: 0,
    iMERCCITLDirectorEndorsements: [],
  });

  useEffect(() => {
    axios
      .get("/api/imerc_citl_director_endorsement", {
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
