import { ActiveCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveCoordinatorByCoordinatorId({
  id,
}: {
  id: string;
}) {
  const [state, setState] = useState<ActiveCoordinator>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<ActiveCoordinator>(`/api/active_coordinator/coordinator/${id}`)
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
