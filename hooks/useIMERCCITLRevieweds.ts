import { IMERCCITLReviewed } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMERCCITLReviewedsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIMERCCITLRevieweds({
  skip,
  take,
  filter,
}: useIMERCCITLReviewedsParams) {
  const [state, setState] = useState<{
    iMERCCITLRevieweds: IMERCCITLReviewed[];
    count: number;
  }>({
    count: 0,
    iMERCCITLRevieweds: [],
  });

  useEffect(() => {
    axios
      .get("/api/imerc_citl_reviewed", {
        params: {
          skip,
          take,
          filter,
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
