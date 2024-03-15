import { User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useUserFacultyParams {
  id?: string;
}
export default function useUserFaculty({ id }: useUserFacultyParams) {
  const [state, setState] = useState<User | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/user/faculty/${id}`)
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
