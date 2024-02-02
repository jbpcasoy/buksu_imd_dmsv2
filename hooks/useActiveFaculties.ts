import { ActiveFaculty } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useActiveFaculties({ skip, take, filter }: useFacultiesParams, refreshFlag?: number) {
  const [state, setState] = useState<{activeFaculties: ActiveFaculty[], count: number}>({
    count: 0,
    activeFaculties: []
  });

  useEffect(() => {
    axios
      .get("/api/active_faculty", {
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
  }, [skip, take, filter, refreshFlag]);

  return state;
}
