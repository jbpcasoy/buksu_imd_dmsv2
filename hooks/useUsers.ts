import { User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useUsersParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useUsers({
  skip,
  take,
  filter,
}: useUsersParams) {
  const [state, setState] = useState<{
    users: User[];
    count: number;
  }>({
    count: 0,
    users: [],
  });

  useEffect(() => {
    axios
      .get("/api/user", {
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
