import { useEffect, useState } from "react";
import { GrammarlyFile } from "@prisma/client";
import axios from "axios";

export interface useGrammarlyFileParams {
  id: string;
}
export default function useGrammarlyFile({ id }: useGrammarlyFileParams) {
  const [state, setState] = useState<GrammarlyFile | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/grammarly_file/${id}`)
      .then((res) => {
        if(!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
