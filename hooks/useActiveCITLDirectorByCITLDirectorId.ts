import { ActiveCITLDirector } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveCITLDirectorByCITLDirectorId({
  id,
}: {
  id: string;
}) {
  const [state, setState] = useState<ActiveCITLDirector>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<ActiveCITLDirector>(`/api/active_citl_director/citl_director/${id}`)
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
