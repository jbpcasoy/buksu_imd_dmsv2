import { ContentEditorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useContentEditorSuggestionItemsOwn({
  skip,
  take,
  id,
}: useContentEditorSuggestionItemsOwnParams, refreshFlag?: number) {
  const [state, setState] = useState<{
    contentEditorSuggestionItems: ContentEditorSuggestionItem[];
    count: number;
  }>({
    count: 0,
    contentEditorSuggestionItems: [],
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/content_editor_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            contentEditorSuggestionId: id,
          },
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, id, refreshFlag]);

  return state;
}
