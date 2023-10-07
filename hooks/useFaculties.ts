import { Faculty } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
}
export default function useFaculties({ skip, take }: useFacultiesParams) {
  const [state, setState] = useState<{faculties: Faculty[], count: number}>({
    count: 0,
    faculties: []
  });

  useEffect(() => {
    axios
      .get("/api/faculty", {
        params: {
          skip,
          take,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take]);

  return state;
}
