import { useEffect, useState } from "react";
import { ContentEditorReview, IM } from "@prisma/client";
import axios from "axios";

export interface useContentEditorReviewParams {
  id: string;
}
export default function useContentEditorReviewMe({ id }: useContentEditorReviewParams) {
  const [state, setState] = useState<ContentEditorReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_editor_review/im/${id}/me`)
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
