import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedIMERCCITLRevisionSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useReturnedIMERCCITLRevisionSuggestionItems({
  skip,
  take,
  filter,
}: useReturnedIMERCCITLRevisionSuggestionItemsParams) {
  const [state, setState] = useState<{
    returnedIMERCCITLRevisionSuggestionItems: ReturnedIMERCCITLRevisionSuggestionItem[];
    count: number;
  }>({
    count: 0,
    returnedIMERCCITLRevisionSuggestionItems: [],
  });

  useEffect(() => {
    axios
      .get("/api/returned_imerc_citl_revision_suggestion_item", {
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
