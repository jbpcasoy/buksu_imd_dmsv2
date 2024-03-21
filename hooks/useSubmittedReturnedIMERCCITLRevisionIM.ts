import { SubmittedReturnedIMERCCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedIMERCCITLRevisionIMParams {
  id: string;
}
export default function useSubmittedReturnedIMERCCITLRevisionIM({
  id,
}: useSubmittedReturnedIMERCCITLRevisionIMParams) {
  const [state, setState] =
    useState<SubmittedReturnedIMERCCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_returned_imerc_citl_revision/im/${id}`)
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
