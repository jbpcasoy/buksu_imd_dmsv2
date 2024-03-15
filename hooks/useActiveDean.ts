import { ActiveDean } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useActiveDeanParams {
  id: string;
}
export default function useActiveDean({ id }: useActiveDeanParams) {
  const [state, setState] = useState<ActiveDean | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_dean/${id}`)
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
  }, [id]);

  return state;
}
