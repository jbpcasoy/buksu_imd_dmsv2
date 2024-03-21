import { IMERCCITLReviewed } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCCITLReviewedIMParams {
  id?: string;
}
export default function useIMERCCITLReviewedIM({
  id,
}: useIMERCCITLReviewedIMParams) {
  const [state, setState] = useState<IMERCCITLReviewed | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/imerc_citl_reviewed/im/${id}`)
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
