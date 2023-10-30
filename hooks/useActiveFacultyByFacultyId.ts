import { ActiveFaculty } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveFacultyByFacultyId({ id }: { id?: string }) {
  const [state, setState] = useState<ActiveFaculty>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<ActiveFaculty>(`/api/active_faculty/faculty/${id}`)
      .then((res) => {
        if (!subscribe) return;

        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  useEffect(() => {
    console.log({ state });
  }, [state]);

  return state;
}
