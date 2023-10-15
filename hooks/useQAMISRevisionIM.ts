import { useEffect, useState } from "react";
import { QAMISRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useQAMISRevisionIMParams {
  id: string;
}
export default function useQAMISRevisionIM({ id }: useQAMISRevisionIMParams) {
  const [state, setState] = useState<QAMISRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_revision/im/${id}`)
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
