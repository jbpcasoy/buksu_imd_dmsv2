import { useEffect, useState } from "react";
import { IDDCoordinator, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDCoordinatorParams {
  id: string;
}
export default function useIDDCoordinator({ id }: useIDDCoordinatorParams) {
  const [state, setState] = useState<IDDCoordinator | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_coordinator/${id}`)
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
