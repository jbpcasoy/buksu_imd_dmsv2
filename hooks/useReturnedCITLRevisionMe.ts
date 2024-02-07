import { useEffect, useState } from "react";
import { ReturnedCITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedCITLRevisionMeParams {
  id: string;
}
export default function useReturnedCITLRevisionMe({ id }: useReturnedCITLRevisionMeParams, refreshFlag?: number) {
  const [state, setState] = useState<ReturnedCITLRevision | null>();

  useEffect(() => {
    console.log({id})
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_citl_revision/im/${id}/me`)
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
  }, [id, refreshFlag]);

  return state;
}
