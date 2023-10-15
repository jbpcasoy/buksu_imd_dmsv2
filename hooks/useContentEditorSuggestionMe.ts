import { useEffect, useState } from "react";
import { ContentEditorSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useContentEditorSuggestionMeParams {
  id: string;
}
export default function useContentEditorSuggestionMe({ id }: useContentEditorSuggestionMeParams) {
  const [state, setState] = useState<ContentEditorSuggestion | null>();

  useEffect(() => {
    console.log({id})
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_editor_suggestion/im/${id}/me`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        if (!subscribe) return;
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
