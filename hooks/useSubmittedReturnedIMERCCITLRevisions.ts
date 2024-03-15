import { SubmittedReturnedIMERCCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedIMERCCITLRevisionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSubmittedReturnedIMERCCITLRevisions({
  skip,
  take,
  filter,
}: useSubmittedReturnedIMERCCITLRevisionsParams) {
  const [state, setState] = useState<{
    submittedReturnedIMERCCITLRevisions: SubmittedReturnedIMERCCITLRevision[];
    count: number;
  }>({
    count: 0,
    submittedReturnedIMERCCITLRevisions: [],
  });

  useEffect(() => {
    axios
      .get("/api/submitted_returned_imerc_citl_revision", {
        params: {
          skip,
          take,
          filter,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter]);

  return state;
}
