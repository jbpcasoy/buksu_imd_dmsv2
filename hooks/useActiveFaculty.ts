import { ActiveFaculty } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useActiveFacultyParams {
  id: string;
}
export default function useActiveFaculty({ id }: useActiveFacultyParams) {
  const [state, setState] = useState<ActiveFaculty | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/active_faculty/${id}`)
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
