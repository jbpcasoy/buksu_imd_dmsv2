import { F011Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF011Params {
  iMId?: string;
}
export default function useF011({ iMId }: useF011Params) {
  const [state, setState] = useState<F011Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f011`)
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
