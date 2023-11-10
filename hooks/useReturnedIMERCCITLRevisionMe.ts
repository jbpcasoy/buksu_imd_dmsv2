import { useEffect, useState } from "react";
import { ReturnedIMERCCITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedIMERCCITLRevisionMeParams {
  id: string;
}
export default function useReturnedIMERCCITLRevisionMe({ id }: useReturnedIMERCCITLRevisionMeParams) {
  const [state, setState] = useState<ReturnedIMERCCITLRevision | null>();

  useEffect(() => {
    console.log({id})
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_imerc_citl_revision/im/${id}/me`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        if (!subscribe) return;
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
