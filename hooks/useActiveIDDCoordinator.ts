import { ActiveIDDCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useActiveIDDCoordinatorParams {
  id: string;
}
export default function useActiveIDDCoordinator({
  id,
}: useActiveIDDCoordinatorParams) {
  const [state, setState] = useState<ActiveIDDCoordinator | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_idd_coordinator/${id}`)
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
