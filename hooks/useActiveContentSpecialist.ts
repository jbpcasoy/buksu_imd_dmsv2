import { ActiveContentSpecialist } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useActiveContentSpecialistParams {
  id: string;
}
export default function useActiveContentSpecialist({
  id,
}: useActiveContentSpecialistParams) {
  const [state, setState] = useState<ActiveContentSpecialist | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_content_specialist/${id}`)
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
