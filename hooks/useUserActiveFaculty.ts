import { useEffect, useState } from "react";
import { User, IM } from "@prisma/client";
import axios from "axios";

export interface useUserActiveFacultyParams {
  id: string;
}
export default function useUserActiveFaculty({
  id,
}: useUserActiveFacultyParams) {
  const [state, setState] = useState<User | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/user/active_faculty/${id}`)
      .then((res) => {
        if (!subscribe) return;
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
