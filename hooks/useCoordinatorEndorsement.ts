import { useEffect, useState } from "react";
import { CoordinatorEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useCoordinatorEndorsementParams {
  id: string;
}
export default function useCoordinatorEndorsement({ id }: useCoordinatorEndorsementParams) {
  const [state, setState] = useState<CoordinatorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/coordinator_endorsement/${id}`)
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
