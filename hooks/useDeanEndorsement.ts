import { useEffect, useState } from "react";
import { DeanEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useDeanEndorsementParams {
  id: string;
}
export default function useDeanEndorsement({ id }: useDeanEndorsementParams) {
  const [state, setState] = useState<DeanEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/dean_endorsement/${id}`)
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
