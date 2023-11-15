import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useMyIMsParams {
  skip: number;
  take: number;
  filter: Object;
  sort: Object;
}
export default function useMyIMs({ skip, take, filter, sort }: useMyIMsParams) {
  const [state, setState] = useState<{ iMs: IM[]; count: number }>({
    count: 0,
    iMs: [],
  });

  useEffect(() => {
    axios
      .get("/api/im/department/my_ims", {
        params: {
          skip,
          take,
          filter,
          sort,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter, sort]);

  return state;
}
