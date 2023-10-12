import { useEffect, useState } from "react";
import { IM } from "@prisma/client";
import axios from "axios";

export interface useIMStatusParams {
  id: string;
}
export default function useIMStatus({ id }: useIMStatusParams) {
  const [state, setState] = useState<string | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<string>(`/api/im/${id}/status`)
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
