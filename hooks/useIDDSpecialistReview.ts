
import { useEffect, useState } from "react";
import { IDDSpecialistReview, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDSpecialistReviewParams {
  id: string;
}
export default function useIDDSpecialistReview({ id }: useIDDSpecialistReviewParams) {
  const [state, setState] = useState<IDDSpecialistReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_specialist_review/${id}`)
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