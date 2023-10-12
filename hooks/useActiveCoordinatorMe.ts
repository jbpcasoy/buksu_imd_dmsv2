import { useEffect, useState } from "react";
import { ActiveCoordinator, IM } from "@prisma/client";
import axios from "axios";

export default function useActiveCoordinatorMe() {
  const [state, setState] = useState<ActiveCoordinator | null>();

  useEffect(() => {

    let subscribe = true;

    axios
      .get(`/api/active_coordinator/me`)
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
