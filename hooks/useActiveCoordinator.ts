import { ActiveCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useActiveCoordinatorParams {
  id: string;
}
export default function useActiveCoordinator({
  id,
}: useActiveCoordinatorParams) {
  const [state, setState] = useState<ActiveCoordinator | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_coordinator/${id}`)
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
