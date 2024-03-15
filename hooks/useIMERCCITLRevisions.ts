import { IMERCCITLRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCCITLRevisionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIMERCCITLRevisions({
  skip,
  take,
  filter,
}: useIMERCCITLRevisionsParams) {
  const [state, setState] = useState<{
    iMERCCITLRevisions: IMERCCITLRevision[];
    count: number;
  }>({
    count: 0,
    iMERCCITLRevisions: [],
  });

  useEffect(() => {
    axios
      .get("/api/imerc_citl_revision", {
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
