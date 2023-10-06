import { useEffect, useState } from "react";
import { IM } from "@prisma/client";
import axios from "axios";

export interface useImParams {
  id: string;
}
export default function useIM({ id }: useImParams) {
  const [state, setState] = useState<IM | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/im/${id}`)
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
