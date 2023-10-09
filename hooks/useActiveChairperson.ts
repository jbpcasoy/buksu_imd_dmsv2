import { useEffect, useState } from "react";
import { ActiveChairperson, IM } from "@prisma/client";
import axios from "axios";

export interface useActiveChairpersonParams {
  id: string;
}
export default function useActiveChairperson({ id }: useActiveChairpersonParams) {
  const [state, setState] = useState<ActiveChairperson | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_chairperson/${id}`)
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
