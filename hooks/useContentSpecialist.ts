import { useEffect, useState } from "react";
import { ContentSpecialist, IM } from "@prisma/client";
import axios from "axios";

export interface useContentSpecialistParams {
  id: string;
}
export default function useContentSpecialist({ id }: useContentSpecialistParams) {
  const [state, setState] = useState<ContentSpecialist | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_specialist/${id}`)
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
