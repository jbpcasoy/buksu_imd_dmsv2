import { ReturnedCITLRevisionSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedCITLRevisionSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useReturnedCITLRevisionSuggestionItemActionTakens({ skip, take, filter }: useReturnedCITLRevisionSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{returnedCITLRevisionSuggestionItemActionTakens: ReturnedCITLRevisionSuggestionItemActionTaken[], count: number}>({
    count: 0,
    returnedCITLRevisionSuggestionItemActionTakens: []
  });

  useEffect(() => {
    axios
      .get("/api/returned_citl_revision_suggestion_item_action_taken", {
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
