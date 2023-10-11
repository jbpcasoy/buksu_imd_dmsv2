import { SubmittedCoordinatorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedCoordinatorSuggestionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useSubmittedCoordinatorSuggestions({ skip, take, filter }: useSubmittedCoordinatorSuggestionsParams) {
  const [state, setState] = useState<{submittedCoordinatorSuggestions: SubmittedCoordinatorSuggestion[], count: number}>({
    count: 0,
    submittedCoordinatorSuggestions: []
  });

  useEffect(() => {
    axios
      .get("/api/submitted_coordinator_suggestion", {
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
