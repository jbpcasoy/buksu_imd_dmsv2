import { ReturnedDepartmentRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedDepartmentRevisionSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useReturnedDepartmentRevisionSuggestionItemsOwn(
  { skip, take, id }: useReturnedDepartmentRevisionSuggestionItemsOwnParams,
  refreshFlag?: number
) {
  const [state, setState] = useState<{
    returnedDepartmentRevisionSuggestionItems: ReturnedDepartmentRevisionSuggestionItem[];
    count: number;
  }>({
    count: 0,
    returnedDepartmentRevisionSuggestionItems: [],
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/returned_department_revision_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            returnedDepartmentRevisionId: id,
          },
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, id, refreshFlag]);

  return state;
}
