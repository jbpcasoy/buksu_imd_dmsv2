import { useEffect, useState } from "react";
import { Dean, IM } from "@prisma/client";
import axios from "axios";

export interface useDeanParams {
  id: string;
}
export default function useDean({ id }: useDeanParams) {
  const [state, setState] = useState<Dean | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/dean/${id}`)
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
