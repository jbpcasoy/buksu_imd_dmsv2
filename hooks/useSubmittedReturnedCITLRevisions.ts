import { SubmittedReturnedCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedReturnedCITLRevisionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSubmittedReturnedCITLRevisions({
  skip,
  take,
  filter,
}: useSubmittedReturnedCITLRevisionsParams) {
  const [state, setState] = useState<{
    submittedReturnedCITLRevisions: SubmittedReturnedCITLRevision[];
    count: number;
  }>({
    count: 0,
    submittedReturnedCITLRevisions: [],
  });

  useEffect(() => {
    axios
      .get("/api/submitted_returned_citl_revision", {
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
