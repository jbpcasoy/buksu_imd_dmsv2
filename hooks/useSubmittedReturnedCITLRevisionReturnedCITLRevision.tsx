import { useEffect, useState } from "react";
import { SubmittedReturnedCITLRevision, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedReturnedCITLRevisionReturnedCITLRevisionParams {
  id?: string;
}
export default function useSubmittedReturnedCITLRevisionReturnedCITLRevision({ id }: useSubmittedReturnedCITLRevisionReturnedCITLRevisionParams) {
  const [state, setState] = useState<SubmittedReturnedCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_returned_citl_revision/returned_citl_revision/${id}`)
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
