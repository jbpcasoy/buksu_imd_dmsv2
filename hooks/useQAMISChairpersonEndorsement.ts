import { useEffect, useState } from "react";
import { QAMISChairpersonEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useQAMISChairpersonEndorsementParams {
  id: string;
}
export default function useQAMISChairpersonEndorsement({ id }: useQAMISChairpersonEndorsementParams) {
  const [state, setState] = useState<QAMISChairpersonEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_chairperson_endorsement/${id}`)
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