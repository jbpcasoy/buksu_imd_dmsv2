import { useEffect, useState } from "react";
import { IMFile } from "@prisma/client";
import axios from "axios";

export interface useIMFileParams {
  id: string;
}
export default function useIMFile({ id }: useIMFileParams) {
  const [state, setState] = useState<IMFile | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/im_file/${id}`)
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
