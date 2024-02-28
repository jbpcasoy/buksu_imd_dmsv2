import { F005Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF005Params {
  iMId?: string;
}
export default function useF005({ iMId }: useF005Params) {
  const [state, setState] = useState<F005Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f005`)
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
