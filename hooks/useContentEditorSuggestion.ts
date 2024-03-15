import { ContentEditorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorSuggestionParams {
  id?: string;
}
export default function useContentEditorSuggestion({
  id,
}: useContentEditorSuggestionParams) {
  const [state, setState] = useState<
    ContentEditorSuggestion | null | undefined
  >(undefined);

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_editor_suggestion/${id}`)
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
