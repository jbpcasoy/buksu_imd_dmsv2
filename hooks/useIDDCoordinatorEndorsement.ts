import { useEffect, useState } from "react";
import { IDDCoordinatorEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDCoordinatorEndorsementParams {
  id?: string;
}
export default function useIDDCoordinatorEndorsement({ id }: useIDDCoordinatorEndorsementParams) {
  const [state, setState] = useState<IDDCoordinatorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_coordinator_endorsement/${id}`)
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
