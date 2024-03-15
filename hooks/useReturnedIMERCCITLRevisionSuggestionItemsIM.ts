import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedIMERCCITLRevisionSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useReturnedIMERCCITLRevisionSuggestionItemsIM({
  skip,
  take,
  id,
}: useReturnedIMERCCITLRevisionSuggestionItemsIMParams) {
  const [state, setState] = useState<{
    returnedIMERCCITLRevisionSuggestionItems: ReturnedIMERCCITLRevisionSuggestionItem[];
    count: number;
  }>({
    count: 0,
    returnedIMERCCITLRevisionSuggestionItems: [],
  });

  useEffect(() => {
    console.log({ skip, take, id });
    if (!id) {
      return;
    }
    axios
      .get(`/api/returned_imerc_citl_revision_suggestion_item/im/${id}`, {
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
