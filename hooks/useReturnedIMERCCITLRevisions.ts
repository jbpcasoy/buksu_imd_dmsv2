import { ReturnedIMERCCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedIMERCCITLRevisionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useReturnedIMERCCITLRevisions({ skip, take, filter }: useReturnedIMERCCITLRevisionsParams) {
  const [state, setState] = useState<{returnedIMERCCITLRevisions: ReturnedIMERCCITLRevision[], count: number}>({
    count: 0,
    returnedIMERCCITLRevisions: []
  });

  useEffect(() => {
    axios
      .get("/api/returned_imerc_citl_revision", {
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
