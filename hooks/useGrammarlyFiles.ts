import { GrammarlyFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useGrammarlyFilesParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useGrammarlyFiles({ skip, take, filter }: useGrammarlyFilesParams) {
  const [state, setState] = useState<{grammarlyFiles: GrammarlyFile[], count: number}>({
    count: 0,
    grammarlyFiles: []
  });

  useEffect(() => {
    axios
      .get("/api/grammarly_file", {
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
