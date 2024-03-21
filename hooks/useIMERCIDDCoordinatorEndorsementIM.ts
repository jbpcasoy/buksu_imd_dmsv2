import { IMERCIDDCoordinatorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCIDDCoordinatorEndorsementIMParams {
  id?: string;
}
export default function useIMERCIDDCoordinatorEndorsementIM({
  id,
}: useIMERCIDDCoordinatorEndorsementIMParams) {
  const [state, setState] = useState<IMERCIDDCoordinatorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/imerc_idd_coordinator_endorsement/im/${id}`)
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
