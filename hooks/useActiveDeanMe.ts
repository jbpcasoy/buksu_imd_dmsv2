import { ActiveDean } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveDeanMe() {
  const [state, setState] = useState<ActiveDean | null>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/active_dean/me`)
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
