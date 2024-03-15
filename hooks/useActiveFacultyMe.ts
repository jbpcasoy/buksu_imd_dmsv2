import { ActiveFaculty } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveFacultyMe() {
  const [state, setState] = useState<ActiveFaculty | null>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/active_faculty/me`)
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
  }, []);

  return state;
}
