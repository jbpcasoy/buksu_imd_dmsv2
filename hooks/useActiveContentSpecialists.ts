import { ActiveContentSpecialist } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useActiveContentSpecialists({ skip, take, filter }: useContentSpecialistsParams) {
  const [state, setState] = useState<{activeContentSpecialists: ActiveContentSpecialist[], count: number}>({
    count: 0,
    activeContentSpecialists: []
  });

  useEffect(() => {
    axios
      .get("/api/active_content_specialist", {
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
