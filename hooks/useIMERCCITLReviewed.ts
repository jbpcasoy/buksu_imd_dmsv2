import { IMERCCITLReviewed } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCCITLReviewedParams {
  id: string;
}
export default function useIMERCCITLReviewed({
  id,
}: useIMERCCITLReviewedParams) {
  const [state, setState] = useState<IMERCCITLReviewed | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/imerc_citl_reviewed/${id}`)
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
