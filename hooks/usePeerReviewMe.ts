import { useEffect, useState } from "react";
import { PeerReview, IM } from "@prisma/client";
import axios from "axios";

export interface usePeerReviewParams {
  id: string;
}
export default function usePeerReviewMe({ id }: usePeerReviewParams) {
  const [state, setState] = useState<PeerReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_review/im/${id}/me`)
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
