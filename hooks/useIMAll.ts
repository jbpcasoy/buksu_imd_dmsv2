import { useEffect, useState } from "react";
import { IM } from "@prisma/client";
import axios from "axios";

export interface useIMParams {
  id?: string;
  refreshFlag?: number;
}
export default function useIMAll({ id, refreshFlag }: useIMParams) {
  const [state, setState] = useState<IM | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/im/${id}/all`)
      .then((res) => {
        if(!subscribe) return;
        setState(res.data);
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