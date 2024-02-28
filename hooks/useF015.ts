import { F015Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF015Params {
  iMId?: string;
}
export default function useF015({ iMId }: useF015Params) {
  const [state, setState] = useState<F015Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f015`)
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
