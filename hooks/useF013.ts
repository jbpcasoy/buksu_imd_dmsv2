import { F013Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF013Params {
  iMId?: string;
}
export default function useF013({ iMId }: useF013Params) {
  const [state, setState] = useState<F013Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f013`)
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
