import { DeanEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useDeanEndorsementIMParams {
  id?: string;
}
export default function useDeanEndorsementIM({
  id,
}: useDeanEndorsementIMParams) {
  const [state, setState] = useState<DeanEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/dean_endorsement/im/${id}`)
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
