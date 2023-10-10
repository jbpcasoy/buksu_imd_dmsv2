import { PeerReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerReviewsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function usePeerReviews({ skip, take, filter }: usePeerReviewsParams) {
  const [state, setState] = useState<{peerReviews: PeerReview[], count: number}>({
    count: 0,
    peerReviews: []
  });

  useEffect(() => {
    axios
      .get("/api/peer_review", {
        params: {
          skip,
          take,
          filter
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter]);

  return state;
}
