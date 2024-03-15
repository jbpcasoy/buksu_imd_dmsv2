import { Department } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useDepartmentMe() {
  const [state, setState] = useState<Department | null>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/department/me`)
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
