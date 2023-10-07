import { useEffect, useState } from "react";
import { User, IM } from "@prisma/client";
import axios from "axios";

export interface useUserParams {
  id: string;
}
export default function useUser({ id }: useUserParams) {
  const [state, setState] = useState<User | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/user/${id}`)
      .then((res) => {
        if(!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
