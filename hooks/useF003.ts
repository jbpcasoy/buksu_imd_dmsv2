import { F003Props } from "@/types/forms";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useF003Params {
  iMId?: string;
}
export default function useF003({ iMId }: useF003Params) {
  const [state, setState] = useState<F003Props | null>();

  useEffect(() => {
    if (!iMId) return;

    let subscribe = true;

    axios
      .get(`/api/im/${iMId}/forms/f003`)
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
