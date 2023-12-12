import { SubmittedReturnedCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedCITLRevisionIMParams {
  id: string;
}
export default function useSubmittedReturnedCITLRevisionIM({
  id,
}: useSubmittedReturnedCITLRevisionIMParams) {
  const [state, setState] = useState<SubmittedReturnedCITLRevision | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_returned_citl_revision/im/${id}`)
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
