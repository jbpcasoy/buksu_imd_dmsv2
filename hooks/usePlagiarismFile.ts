import { PlagiarismFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePlagiarismFileParams {
  id: string;
}
export default function usePlagiarismFile({ id }: usePlagiarismFileParams) {
  const [state, setState] = useState<PlagiarismFile | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/plagiarism_file/${id}`)
      .then((res) => {
        if (!subscribe) return;
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
