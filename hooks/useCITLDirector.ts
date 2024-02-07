import { useEffect, useState } from "react";
import { CITLDirector, IM } from "@prisma/client";
import axios from "axios";

export interface useCITLDirectorParams {
  id?: string;
}
export default function useCITLDirector({ id }: useCITLDirectorParams) {
  const [state, setState] = useState<CITLDirector | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/citl_director/${id}`)
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
