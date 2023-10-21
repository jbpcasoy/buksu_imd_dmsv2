import { useEffect, useState } from "react";
import { ChairpersonReview, IM } from "@prisma/client";
import axios from "axios";

export interface useChairpersonReviewIMParams {
  id?: string;
}
export default function useChairpersonReviewIM({
  id,
}: useChairpersonReviewIMParams) {
  const [state, setState] = useState<ChairpersonReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/chairperson_review/im/${id}`)
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
