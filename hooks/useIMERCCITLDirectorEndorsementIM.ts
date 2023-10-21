import { useEffect, useState } from "react";
import { IMERCCITLDirectorEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useIMERCCITLDirectorEndorsementIMParams {
  id?: string;
}
export default function useIMERCCITLDirectorEndorsementIM({
  id,
}: useIMERCCITLDirectorEndorsementIMParams) {
  const [state, setState] = useState<IMERCCITLDirectorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/imerc_citl_director_endorsement/im/${id}`)
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
