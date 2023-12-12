import { useEffect, useState } from "react";
import { ReturnedCITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedCITLRevisionParams {
  id?: string;
}
export default function useReturnedCITLRevision({ id }: useReturnedCITLRevisionParams) {
  const [state, setState] = useState<ReturnedCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_citl_revision/${id}`)
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
