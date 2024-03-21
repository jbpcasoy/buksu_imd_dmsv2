import { QAMISRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISRevisionParams {
  id: string;
}
export default function useQAMISRevision({ id }: useQAMISRevisionParams) {
  const [state, setState] = useState<QAMISRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_revision/${id}`)
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
