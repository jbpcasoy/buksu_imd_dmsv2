import { ActiveCITLDirector } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveCITLDirectorMe() {
  const [state, setState] = useState<ActiveCITLDirector | null>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/active_citl_director/me`)
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
  }, []);

  return state;
}
