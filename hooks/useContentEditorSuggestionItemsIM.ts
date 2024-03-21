import { ContentEditorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentEditorSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useContentEditorSuggestionItemsIM({
  skip,
  take,
  id,
}: useContentEditorSuggestionItemsIMParams) {
  const [state, setState] = useState<{
    contentEditorSuggestionItems: ContentEditorSuggestionItem[];
    count: number;
  }>({
    count: 0,
    contentEditorSuggestionItems: [],
  });

  useEffect(() => {
    console.log({ skip, take, id });
    if (!id) {
      return;
    }
    axios
      .get(`/api/content_editor_suggestion_item/im/${id}`, {
        params: {
          skip,
          take,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, id]);

  return state;
}
