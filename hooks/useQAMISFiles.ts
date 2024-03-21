import { QAMISFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISFilesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useQAMISFiles({
  skip,
  take,
  filter,
}: useQAMISFilesParams) {
  const [state, setState] = useState<{
    qAMISFiles: QAMISFile[];
    count: number;
  }>({
    count: 0,
    qAMISFiles: [],
  });

  useEffect(() => {
    axios
      .get("/api/qamis_file", {
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
