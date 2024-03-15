import { QAMISCoordinatorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISCoordinatorEndorsementParams {
  id: string;
}
export default function useQAMISCoordinatorEndorsement({
  id,
}: useQAMISCoordinatorEndorsementParams) {
  const [state, setState] = useState<QAMISCoordinatorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_coordinator_endorsement/${id}`)
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
