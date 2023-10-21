import { useEffect, useState } from "react";
import { CoordinatorEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useCoordinatorEndorsementIMParams {
  id?: string;
}
export default function useCoordinatorEndorsementIM({
  id,
}: useCoordinatorEndorsementIMParams) {
  const [state, setState] = useState<CoordinatorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/coordinator_endorsement/im/${id}`)
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
