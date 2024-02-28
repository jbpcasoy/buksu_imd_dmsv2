import { F004Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF004Params {
  iMId?: string;
}
export default function useF004({ iMId }: useF004Params) {
  const [state, setState] = useState<F004Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f004`)
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
