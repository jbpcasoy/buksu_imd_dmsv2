import { ActiveChairperson } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveChairpersonByChairpersonId({ id }: { id: string }) {
  const [state, setState] = useState<ActiveChairperson>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<ActiveChairperson>(`/api/active_chairperson/chairperson/${id}`)
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
