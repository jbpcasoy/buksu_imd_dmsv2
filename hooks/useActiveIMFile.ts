import { useEffect, useState } from "react";
import { ActiveIMFile, IM } from "@prisma/client";
import axios from "axios";

export interface useActiveIMFileParams {
  id: string;
}
export default function useActiveIMFile({ id }: useActiveIMFileParams) {
  const [state, setState] = useState<ActiveIMFile | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_im_file/${id}`)
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
