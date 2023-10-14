import { useEffect, useState } from "react";
import { ActiveIDDCoordinator, IM } from "@prisma/client";
import axios from "axios";

export default function useActiveIDDCoordinatorMe() {
  const [state, setState] = useState<ActiveIDDCoordinator | null>();

  useEffect(() => {

    let subscribe = true;

    axios
      .get(`/api/active_idd_coordinator/me`)
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
  }, []);

  return state;
}
