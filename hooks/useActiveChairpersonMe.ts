import { ActiveChairperson } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveChairpersonMe() {
  const [state, setState] = useState<ActiveChairperson | null>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/active_chairperson/me`)
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
