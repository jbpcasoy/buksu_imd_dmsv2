import { useEffect, useState } from "react";
import { CoordinatorReview, IM } from "@prisma/client";
import axios from "axios";

export interface useCoordinatorReviewParams {
  id: string;
}
export default function useCoordinatorReviewMe({ id }: useCoordinatorReviewParams) {
  const [state, setState] = useState<CoordinatorReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/coordinator_review/im/${id}/me`)
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
