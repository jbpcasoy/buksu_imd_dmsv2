import { ActiveDean } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveDeanByDeanId({ id }: { id: string }) {
  const [state, setState] = useState<ActiveDean>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<ActiveDean>(`/api/active_dean/dean/${id}`)
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
