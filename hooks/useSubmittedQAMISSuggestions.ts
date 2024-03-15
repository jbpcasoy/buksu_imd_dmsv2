import { SubmittedQAMISSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedQAMISSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSubmittedQAMISSuggestions({
  skip,
  take,
  filter,
}: useSubmittedQAMISSuggestionsParams) {
  const [state, setState] = useState<{
    submittedQAMISSuggestions: SubmittedQAMISSuggestion[];
    count: number;
  }>({
    count: 0,
    submittedQAMISSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/submitted_qamis_suggestion", {
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
