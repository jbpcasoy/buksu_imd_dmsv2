import { PlagiarismFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePlagiarismFilesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function usePlagiarismFiles({
  skip,
  take,
  filter,
}: usePlagiarismFilesParams) {
  const [state, setState] = useState<{
    plagiarismFiles: PlagiarismFile[];
    count: number;
  }>({
    count: 0,
    plagiarismFiles: [],
  });

  useEffect(() => {
    axios
      .get("/api/plagiarism_file", {
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
