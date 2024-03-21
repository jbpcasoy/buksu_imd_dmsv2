import { ContentEditorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useContentEditorSuggestions({
  skip,
  take,
  filter,
}: useContentEditorSuggestionsParams) {
  const [state, setState] = useState<{
    contentEditorSuggestions: ContentEditorSuggestion[];
    count: number;
  }>({
    count: 0,
    contentEditorSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/content_editor_suggestion", {
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
