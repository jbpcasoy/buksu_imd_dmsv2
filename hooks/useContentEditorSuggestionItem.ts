import { useEffect, useState } from "react";
import { ContentEditorSuggestionItem, IM } from "@prisma/client";
import axios from "axios";

export interface useContentEditorSuggestionItemParams {
  id: string;
}
export default function useContentEditorSuggestionItem({ id }: useContentEditorSuggestionItemParams) {
  const [state, setState] = useState<ContentEditorSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_editor_suggestion_item/${id}`)
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
