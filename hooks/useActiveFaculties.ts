import { ActiveFaculty } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
  options?: object;
}
export default function useActiveFaculties(
  { skip, take, filter, options }: useFacultiesParams,
  refreshFlag?: number
) {
  const [state, setState] = useState<{
    activeFaculties: ActiveFaculty[];
    count: number;
  }>({
    count: 0,
    activeFaculties: [],
  });

  useEffect(() => {
    axios
      .get("/api/active_faculty", {
        params: {
          skip,
          take,
          filter,
          options,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter, options, refreshFlag]);

  return state;
}
