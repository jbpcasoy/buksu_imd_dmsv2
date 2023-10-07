import { College } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCollegesParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useColleges({ skip, take, filter }: useCollegesParams) {
  const [state, setState] = useState<{colleges: College[], count: number}>({
    count: 0,
    colleges: []
  });

  useEffect(() => {
    axios
      .get("/api/college", {
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
