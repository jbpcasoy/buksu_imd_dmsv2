import { ReturnedCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedCITLRevisionSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useReturnedCITLRevisionSuggestionItemsIM({
  skip,
  take,
  id,
}: useReturnedCITLRevisionSuggestionItemsIMParams) {
  const [state, setState] = useState<{
    returnedCITLRevisionSuggestionItems: ReturnedCITLRevisionSuggestionItem[];
    count: number;
  }>({
    count: 0,
    returnedCITLRevisionSuggestionItems: [],
  });

  useEffect(() => {
    console.log({ skip, take, id });
    if (!id) {
      return;
    }
    axios
      .get(`/api/returned_citl_revision_suggestion_item/im/${id}`, {
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
