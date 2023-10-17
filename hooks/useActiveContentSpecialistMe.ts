import { useEffect, useState } from "react";
import { ActiveContentSpecialist, IM } from "@prisma/client";
import axios from "axios";

export default function useActiveContentSpecialistMe() {
  const [state, setState] = useState<ActiveContentSpecialist | null>();

  useEffect(() => {

    let subscribe = true;

    axios
      .get(`/api/active_content_specialist/me`)
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
