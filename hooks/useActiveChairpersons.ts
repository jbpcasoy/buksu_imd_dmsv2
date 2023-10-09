import { ActiveChairperson } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useActiveChairpersons({ skip, take, filter }: useChairpersonsParams) {
  const [state, setState] = useState<{activeChairpersons: ActiveChairperson[], count: number}>({
    count: 0,
    activeChairpersons: []
  });

  useEffect(() => {
    axios
      .get("/api/active_chairperson", {
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
