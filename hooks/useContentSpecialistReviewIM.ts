import { useEffect, useState } from "react";
import { ContentSpecialistReview, IM } from "@prisma/client";
import axios from "axios";

export interface useContentSpecialistReviewIMParams {
  id: string;
}
export default function useContentSpecialistReviewIM({ id }: useContentSpecialistReviewIMParams) {
  const [state, setState] = useState<ContentSpecialistReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_specialist_review/im/${id}`)
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
