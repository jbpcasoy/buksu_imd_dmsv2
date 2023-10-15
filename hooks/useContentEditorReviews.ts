import { ContentEditorReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorReviewsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useContentEditorReviews({ skip, take, filter }: useContentEditorReviewsParams) {
  const [state, setState] = useState<{contentEditorReviews: ContentEditorReview[], count: number}>({
    count: 0,
    contentEditorReviews: []
  });

  useEffect(() => {
    axios
      .get("/api/content_editor_review", {
        params: {
          skip,
          take,
          filter
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
