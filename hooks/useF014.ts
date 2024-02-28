import { F014Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF014Params {
  iMId?: string;
}
export default function useF014({ iMId }: useF014Params) {
  const [state, setState] = useState<F014Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f014`)
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
