import { Event } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useEventsMeParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useEventsMe({ skip, take, filter }: useEventsMeParams) {
  const [state, setState] = useState<{events: Event[], count: number}>({
    count: 0,
    events: []
  });

  useEffect(() => {
    axios
      .get("/api/event/me", {
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
