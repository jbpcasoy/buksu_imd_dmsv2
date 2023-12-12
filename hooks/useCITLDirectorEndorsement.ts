import { useEffect, useState } from "react";
import { CITLDirectorEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useCITLDirectorEndorsementParams {
  id?: string;
}
export default function useCITLDirectorEndorsement({ id }: useCITLDirectorEndorsementParams) {
  const [state, setState] = useState<CITLDirectorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/citl_director_endorsement/${id}`)
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
