import { QAMISSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string
}
export default function useQAMISSuggestionItemsIM({ skip, take, id }: useQAMISSuggestionItemsIMParams) {
  const [state, setState] = useState<{qAMISSuggestionItems: QAMISSuggestionItem[], count: number}>({
    count: 0,
    qAMISSuggestionItems: []
  });

  useEffect(() => {
    console.log({skip, take, id})
    if(!id) {
        return;
    }
    axios
      .get(`/api/qamis_suggestion_item/im/${id}`, {
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
