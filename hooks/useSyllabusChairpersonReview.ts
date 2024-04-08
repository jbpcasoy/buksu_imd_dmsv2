import { SyllabusChairpersonReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSyllabusChairpersonReviewParams {
  id?: string;
}
export default function useSyllabusChairpersonReview({
  id,
}: useSyllabusChairpersonReviewParams) {
  const [state, setState] = useState<SyllabusChairpersonReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/syllabus_chairperson_review/${id}`)
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
