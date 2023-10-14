import { useEffect, useState } from "react";
import { QAMISFile } from "@prisma/client";
import axios from "axios";

export interface useQAMISFileParams {
  id: string;
}
export default function useQAMISFile({ id }: useQAMISFileParams) {
  const [state, setState] = useState<QAMISFile | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_file/${id}`)
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
