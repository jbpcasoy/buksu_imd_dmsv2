import { useEffect, useState } from "react";
import { IMERCCITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useIMERCCITLRevisionParams {
  id: string;
}
export default function useIMERCCITLRevision({ id }: useIMERCCITLRevisionParams) {
  const [state, setState] = useState<IMERCCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/imerc_citl_revision/${id}`)
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
