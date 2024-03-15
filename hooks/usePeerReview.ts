import { PeerReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerReviewParams {
  id?: string;
}
export default function usePeerReview({ id }: usePeerReviewParams) {
  const [state, setState] = useState<PeerReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_review/${id}`)
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
