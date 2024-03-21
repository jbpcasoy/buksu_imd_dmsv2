import { CITLDirectorEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCITLDirectorEndorsementIMParams {
  id?: string;
}
export default function useCITLDirectorEndorsementIM({
  id,
}: useCITLDirectorEndorsementIMParams) {
  const [state, setState] = useState<CITLDirectorEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/citl_director_endorsement/im/${id}`)
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
