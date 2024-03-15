import { ReturnedCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedCITLRevisionSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useReturnedCITLRevisionSuggestionItems({
  skip,
  take,
  filter,
}: useReturnedCITLRevisionSuggestionItemsParams) {
  const [state, setState] = useState<{
    returnedCITLRevisionSuggestionItems: ReturnedCITLRevisionSuggestionItem[];
    count: number;
  }>({
    count: 0,
    returnedCITLRevisionSuggestionItems: [],
  });

  useEffect(() => {
    axios
      .get("/api/returned_citl_revision_suggestion_item", {
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
