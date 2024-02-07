import { User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useUsersParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useUsers({ skip, take, filter, sort }: useUsersParams) {
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
