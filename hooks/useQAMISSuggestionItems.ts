import { QAMISSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useQAMISSuggestionItems({
  skip,
  take,
  filter,
}: useQAMISSuggestionItemsParams) {
  const [state, setState] = useState<{
    qAMISSuggestionItems: QAMISSuggestionItem[];
    count: number;
  }>({
    count: 0,
    qAMISSuggestionItems: [],
  });

  useEffect(() => {
    axios
      .get("/api/qamis_suggestion_item", {
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
