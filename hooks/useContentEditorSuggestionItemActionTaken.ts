import { ContentEditorSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorSuggestionItemActionTakenParams {
  id: string;
}
export default function useContentEditorSuggestionItemActionTaken({
  id,
}: useContentEditorSuggestionItemActionTakenParams) {
  const [state, setState] =
    useState<ContentEditorSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_editor_suggestion_item_action_taken/${id}`)
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
