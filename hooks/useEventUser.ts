import { Event } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useEventsUserParams {
  skip: number;
  take: number;
  filter?: object;
  id: string;
}
export default function useEventsUser({
  skip,
  take,
  filter,
  id,
}: useEventsUserParams) {
  const [state, setState] = useState<{ events: Event[]; count: number }>({
    count: 0,
    events: [],
  });

  useEffect(() => {
    axios
      .get(`/api/event/user/${id}`, {
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
