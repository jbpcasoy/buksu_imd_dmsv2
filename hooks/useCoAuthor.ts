import { CoAuthor } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoAuthorParams {
  id?: string;
}
export default function useCoAuthor({ id }: useCoAuthorParams) {
  const [state, setState] = useState<CoAuthor | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/co_author/${id}`)
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
