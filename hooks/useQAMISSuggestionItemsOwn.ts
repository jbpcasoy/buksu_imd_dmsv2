import { QAMISSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string
}
export default function useQAMISSuggestionItemsOwn({ skip, take, id }: useQAMISSuggestionItemsOwnParams) {
  const [state, setState] = useState<{qAMISSuggestionItems: QAMISSuggestionItem[], count: number}>({
    count: 0,
    qAMISSuggestionItems: []
  });

  useEffect(() => {
    if(!id) {
        return;
    }
    axios
      .get("/api/qamis_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            qAMISSuggestionId: id
          }
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
