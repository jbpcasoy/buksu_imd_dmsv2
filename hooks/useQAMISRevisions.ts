import { QAMISRevision } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISRevisionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useQAMISRevisions({ skip, take, filter }: useQAMISRevisionsParams) {
  const [state, setState] = useState<{qAMISRevisions: QAMISRevision[], count: number}>({
    count: 0,
    qAMISRevisions: []
  });

  useEffect(() => {
    axios
      .get("/api/qamis_revision", {
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
