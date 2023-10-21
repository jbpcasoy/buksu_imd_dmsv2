import { useEffect, useState } from "react";
import { IDDCoordinatorEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDCoordinatorEndorsementIMParams {
  id?: string;
}
export default function useIDDCoordinatorEndorsementIM({
  id,
}: useIDDCoordinatorEndorsementIMParams) {
  const [state, setState] = useState<IDDCoordinatorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_coordinator_endorsement/im/${id}`)
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
