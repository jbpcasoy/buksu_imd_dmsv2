import { ChairpersonReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonReviewParams {
  id: string;
}
export default function useChairpersonReviewMe({
  id,
}: useChairpersonReviewParams) {
  const [state, setState] = useState<ChairpersonReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/chairperson_review/im/${id}/me`)
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
