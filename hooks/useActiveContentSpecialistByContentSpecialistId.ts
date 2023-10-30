import { ActiveContentSpecialist } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useActiveContentSpecialistByContentSpecialistId({
  id,
}: {
  id: string;
}) {
  const [state, setState] = useState<ActiveContentSpecialist>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get<ActiveContentSpecialist>(
        `/api/active_content_specialist/content_specialist/${id}`
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
