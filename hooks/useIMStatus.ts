import IMState from "@/types/IMStatus";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMStatusParams {
  id?: string;
  refreshFlag?: number;
}
export default function useIMStatus({ id, refreshFlag }: useIMStatusParams) {
  const [state, setState] = useState<IMState | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<string>(`/api/im/${id}/status`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data as IMState);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id, refreshFlag]);

  return state;
}
