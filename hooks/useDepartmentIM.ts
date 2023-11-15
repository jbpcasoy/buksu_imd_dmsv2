import { useEffect, useState } from "react";
import { Department, IM } from "@prisma/client";
import axios from "axios";

export interface useDepartmentIMParams {
  id: string;
}
export default function useDepartmentIM({ id }: useDepartmentIMParams) {
  const [state, setState] = useState<Department | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/department/im/${id}`)
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
