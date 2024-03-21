import { IMERCIDDCoordinatorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCIDDCoordinatorEndorsementParams {
  id: string;
}
export default function useIMERCIDDCoordinatorEndorsement({
  id,
}: useIMERCIDDCoordinatorEndorsementParams) {
  const [state, setState] = useState<IMERCIDDCoordinatorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/imerc_idd_coordinator_endorsement/${id}`)
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
