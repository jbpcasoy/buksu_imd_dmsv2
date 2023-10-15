import { SubmittedContentEditorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedContentEditorSuggestionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useSubmittedContentEditorSuggestions({ skip, take, filter }: useSubmittedContentEditorSuggestionsParams) {
  const [state, setState] = useState<{submittedContentEditorSuggestions: SubmittedContentEditorSuggestion[], count: number}>({
    count: 0,
    submittedContentEditorSuggestions: []
  });

  useEffect(() => {
    axios
      .get("/api/submitted_content_editor_suggestion", {
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
