import { useEffect, useState } from "react";
import { College, IM } from "@prisma/client";
import axios from "axios";

export interface useCollegeParams {
  id: string;
}
export default function useCollege({ id }: useCollegeParams) {
  const [state, setState] = useState<College | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/college/${id}`)
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
