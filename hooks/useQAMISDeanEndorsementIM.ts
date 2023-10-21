import { useEffect, useState } from "react";
import { QAMISDeanEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useQAMISDeanEndorsementIMParams {
  id?: string;
}
export default function useQAMISDeanEndorsementIM({
  id,
}: useQAMISDeanEndorsementIMParams) {
  const [state, setState] = useState<QAMISDeanEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_dean_endorsement/im/${id}`)
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
