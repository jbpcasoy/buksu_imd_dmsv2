import { IMERCCITLDirectorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCCITLDirectorEndorsementParams {
  id: string;
}
export default function useIMERCCITLDirectorEndorsement({
  id,
}: useIMERCCITLDirectorEndorsementParams) {
  const [state, setState] = useState<IMERCCITLDirectorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/imerc_citl_director_endorsement/${id}`)
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
