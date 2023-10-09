import { useEffect, useState } from "react";
import { Chairperson, IM } from "@prisma/client";
import axios from "axios";

export interface useChairpersonParams {
  id: string;
}
export default function useChairperson({ id }: useChairpersonParams) {
  const [state, setState] = useState<Chairperson | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/chairperson/${id}`)
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
