import { F012Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF012Params {
  iMId?: string;
}
export default function useF012({ iMId }: useF012Params) {
  const [state, setState] = useState<F012Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f012`)
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
  }, [iMId]);

  return state;
}
