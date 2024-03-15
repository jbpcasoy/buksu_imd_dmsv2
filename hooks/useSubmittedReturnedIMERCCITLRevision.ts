import { SubmittedReturnedIMERCCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedIMERCCITLRevisionParams {
  id: string;
}
export default function useSubmittedReturnedIMERCCITLRevision({
  id,
}: useSubmittedReturnedIMERCCITLRevisionParams) {
  const [state, setState] =
    useState<SubmittedReturnedIMERCCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_returned_imerc_citl_revision/${id}`)
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
