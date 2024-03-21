import { ActiveCITLDirector } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useActiveCITLDirectorParams {
  id: string;
}
export default function useActiveCITLDirector({
  id,
}: useActiveCITLDirectorParams) {
  const [state, setState] = useState<ActiveCITLDirector | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_citl_director/${id}`)
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
