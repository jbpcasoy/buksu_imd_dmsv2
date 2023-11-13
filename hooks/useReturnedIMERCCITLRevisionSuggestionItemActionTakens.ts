import { ReturnedIMERCCITLRevisionSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedIMERCCITLRevisionSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useReturnedIMERCCITLRevisionSuggestionItemActionTakens({ skip, take, filter }: useReturnedIMERCCITLRevisionSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{returnedIMERCCITLRevisionSuggestionItemActionTakens: ReturnedIMERCCITLRevisionSuggestionItemActionTaken[], count: number}>({
    count: 0,
    returnedIMERCCITLRevisionSuggestionItemActionTakens: []
  });

  useEffect(() => {
    axios
      .get("/api/returned_imerc_citl_revision_suggestion_item_action_taken", {
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
