import { College } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCollegeIMParams {
  id: string;
}
export default function useCollegeIM({ id }: useCollegeIMParams) {
  const [state, setState] = useState<College | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/college/im/${id}`)
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
