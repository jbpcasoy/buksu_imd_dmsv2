import { useEffect, useState } from "react";
import { Faculty, IM } from "@prisma/client";
import axios from "axios";

export interface useFacultyParams {
  id: string;
}
export default function useFaculty({ id }: useFacultyParams) {
  const [state, setState] = useState<Faculty | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/faculty/${id}`)
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
