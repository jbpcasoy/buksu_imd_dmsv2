import { CITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCITLRevisionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useCITLRevisions({ skip, take, filter }: useCITLRevisionsParams) {
  const [state, setState] = useState<{cITLRevisions: CITLRevision[], count: number}>({
    count: 0,
    cITLRevisions: []
  });

  useEffect(() => {
    axios
      .get("/api/citl_revision", {
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
