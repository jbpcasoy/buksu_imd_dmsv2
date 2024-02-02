import { CoAuthor } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoAuthorsParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useCoAuthors({
  skip,
  take,
  filter,
  sort,
}: useCoAuthorsParams, refreshFlag?: number) {
  const [state, setState] = useState<{ coAuthors: CoAuthor[]; count: number }>({
    count: 0,
    coAuthors: [],
  });

  useEffect(() => {
    axios
      .get("/api/co_author", {
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
  }, [skip, take, filter, sort, refreshFlag]);

  return state;
}
