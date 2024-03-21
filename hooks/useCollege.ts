import { College } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCollegeParams {
  id?: string;
}
export default function useCollege({ id }: useCollegeParams) {
  const [state, setState] = useState<College | null>();

  useEffect(() => {
    if (!id) {
      setState(null);
      return;
    }

    let subscribe = true;

    axios
      .get(`/api/college/${id}`)
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
