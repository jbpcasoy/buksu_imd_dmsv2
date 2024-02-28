import { F001Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF001Params {
  iMId?: string;
}
export default function useF001({ iMId }: useF001Params) {
  const [state, setState] = useState<F001Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f001`)
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
