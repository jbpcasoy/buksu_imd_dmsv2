import { ContentEditorSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useContentEditorSuggestionItemActionTakens({ skip, take, filter }: useContentEditorSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{contentEditorSuggestionItemActionTakens: ContentEditorSuggestionItemActionTaken[], count: number}>({
    count: 0,
    contentEditorSuggestionItemActionTakens: []
  });

  useEffect(() => {
    axios
      .get("/api/content_editor_suggestion_item_action_taken", {
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
