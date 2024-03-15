import { PeerReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerReviewIMParams {
  id?: string;
}
export default function usePeerReviewIM({ id }: usePeerReviewIMParams) {
  const [state, setState] = useState<PeerReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_review/im/${id}`)
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
  }, [id]);

  return state;
}
