import { ReturnedDepartmentRevisionSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedDepartmentRevisionSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useReturnedDepartmentRevisionSuggestionItemActionTakens({ skip, take, filter }: useReturnedDepartmentRevisionSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{returnedDepartmentRevisionSuggestionItemActionTakens: ReturnedDepartmentRevisionSuggestionItemActionTaken[], count: number}>({
    count: 0,
    returnedDepartmentRevisionSuggestionItemActionTakens: []
  });

  useEffect(() => {
    axios
      .get("/api/returned_department_revision_suggestion_item_action_taken", {
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
