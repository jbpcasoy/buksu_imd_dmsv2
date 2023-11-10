import { useEffect, useState } from "react";
import { SubmittedReturnedIMERCCITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevisionParams {
  id?: string;
}
export default function useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevision({ id }: useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevisionParams) {
  const [state, setState] = useState<SubmittedReturnedIMERCCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_returned_imerc_citl_revision/returned_imerc_citl_revision/${id}`)
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
