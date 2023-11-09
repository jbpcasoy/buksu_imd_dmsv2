import { ReturnedCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedCITLRevisionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useReturnedCITLRevisions({ skip, take, filter }: useReturnedCITLRevisionsParams) {
  const [state, setState] = useState<{returnedCITLRevisions: ReturnedCITLRevision[], count: number}>({
    count: 0,
    returnedCITLRevisions: []
  });

  useEffect(() => {
    axios
      .get("/api/returned_citl_revision", {
        params: {
          skip,
          take,
          filter
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
