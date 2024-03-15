import { ContentEditorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useContentEditorSuggestionItems({
  skip,
  take,
  filter,
}: useContentEditorSuggestionItemsParams) {
  const [state, setState] = useState<{
    contentEditorSuggestionItems: ContentEditorSuggestionItem[];
    count: number;
  }>({
    count: 0,
    contentEditorSuggestionItems: [],
  });

  useEffect(() => {
    axios
      .get("/api/content_editor_suggestion_item", {
        params: {
          skip,
          take,
          filter,
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
