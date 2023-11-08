import { ReturnedDepartmentRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedDepartmentRevisionSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useReturnedDepartmentRevisionSuggestionItems({ skip, take, filter }: useReturnedDepartmentRevisionSuggestionItemsParams) {
  const [state, setState] = useState<{returnedDepartmentRevisionSuggestionItems: ReturnedDepartmentRevisionSuggestionItem[], count: number}>({
    count: 0,
    returnedDepartmentRevisionSuggestionItems: []
  });

  useEffect(() => {
    axios
      .get("/api/returned_department_revision_suggestion_item", {
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
