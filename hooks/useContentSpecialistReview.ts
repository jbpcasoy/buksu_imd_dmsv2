import { ContentSpecialistReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistReviewParams {
  id?: string;
}
export default function useContentSpecialistReview({
  id,
}: useContentSpecialistReviewParams) {
  const [state, setState] = useState<ContentSpecialistReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_specialist_review/${id}`)
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
