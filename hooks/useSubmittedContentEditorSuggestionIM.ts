import { useEffect, useState } from "react";
import { SubmittedContentEditorSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedContentEditorSuggestionIMParams {
  id?: string;
}
export default function useSubmittedContentEditorSuggestionIM({
  id,
}: useSubmittedContentEditorSuggestionIMParams) {
  const [state, setState] =
    useState<SubmittedContentEditorSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_content_editor_suggestion/im/${id}`)
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
