import { useEffect, useState } from "react";
import { Coordinator, IM } from "@prisma/client";
import axios from "axios";

export interface useCoordinatorParams {
  id?: string;
}
export default function useCoordinator({ id }: useCoordinatorParams) {
  const [state, setState] = useState<Coordinator | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/coordinator/${id}`)
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
  }, [id]);

  return state;
}
