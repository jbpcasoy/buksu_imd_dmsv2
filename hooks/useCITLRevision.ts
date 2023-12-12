import { useEffect, useState } from "react";
import { CITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useCITLRevisionParams {
  id?: string;
}
export default function useCITLRevision({ id }: useCITLRevisionParams) {
  const [state, setState] = useState<CITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/citl_revision/${id}`)
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
