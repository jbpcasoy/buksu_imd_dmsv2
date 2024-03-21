import { ContentSpecialist } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistsParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useContentSpecialists({
  skip,
  take,
  filter,
  sort,
}: useContentSpecialistsParams) {
  const [state, setState] = useState<{
    contentSpecialists: ContentSpecialist[];
    count: number;
  }>({
    count: 0,
    contentSpecialists: [],
  });

  useEffect(() => {
    axios
      .get("/api/content_specialist", {
        params: {
          skip,
          take,
          filter,
          sort,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter, sort]);

  return state;
}
