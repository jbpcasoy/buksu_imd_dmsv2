import { useEffect, useState } from "react";
import { ReturnedIMERCCITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedIMERCCITLRevisionParams {
  id?: string;
}
export default function useReturnedIMERCCITLRevision({ id }: useReturnedIMERCCITLRevisionParams) {
  const [state, setState] = useState<ReturnedIMERCCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_imerc_citl_revision/${id}`)
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
