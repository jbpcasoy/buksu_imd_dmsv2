import { SubmittedIDDCoordinatorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedIDDCoordinatorSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSubmittedIDDCoordinatorSuggestions({
  skip,
  take,
  filter,
}: useSubmittedIDDCoordinatorSuggestionsParams) {
  const [state, setState] = useState<{
    submittedIDDCoordinatorSuggestions: SubmittedIDDCoordinatorSuggestion[];
    count: number;
  }>({
    count: 0,
    submittedIDDCoordinatorSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/submitted_idd_coordinator_suggestion", {
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
