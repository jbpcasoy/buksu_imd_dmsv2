import { SubmittedContentEditorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedContentEditorSuggestionParams {
  id: string;
}
export default function useSubmittedContentEditorSuggestion({
  id,
}: useSubmittedContentEditorSuggestionParams) {
  const [state, setState] = useState<SubmittedContentEditorSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_content_editor_suggestion/${id}`)
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
