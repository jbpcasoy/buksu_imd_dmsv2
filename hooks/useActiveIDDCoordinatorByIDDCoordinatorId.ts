import { ActiveIDDCoordinator } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveIDDCoordinatorByIDDCoordinatorId({
  id,
}: {
  id: string;
}) {
  const [state, setState] = useState<ActiveIDDCoordinator>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<ActiveIDDCoordinator>(
        `/api/active_idd_coordinator/idd_coordinator/${id}`
      )
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
