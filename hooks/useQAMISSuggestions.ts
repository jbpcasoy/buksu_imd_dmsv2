import { QAMISSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useQAMISSuggestions({
  skip,
  take,
  filter,
}: useQAMISSuggestionsParams) {
  const [state, setState] = useState<{
    qAMISSuggestions: QAMISSuggestion[];
    count: number;
  }>({
    count: 0,
    qAMISSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/qamis_suggestion", {
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
