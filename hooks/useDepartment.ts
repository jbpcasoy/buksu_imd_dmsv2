import { useEffect, useState } from "react";
import { Department, IM } from "@prisma/client";
import axios from "axios";

export interface useDepartmentParams {
  id: string;
}
export default function useDepartment({ id }: useDepartmentParams) {
  const [state, setState] = useState<Department | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/department/${id}`)
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
