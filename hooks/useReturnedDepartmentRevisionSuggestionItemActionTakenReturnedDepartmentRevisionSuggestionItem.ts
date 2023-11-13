import { useEffect, useState } from "react";
import { ReturnedDepartmentRevisionSuggestionItemActionTaken, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItemParams {
  id: string;
}
export default function useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem({ id }: useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItemParams) {
  const [state, setState] = useState<ReturnedDepartmentRevisionSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_department_revision_suggestion_item_action_taken/returned_department_revision_suggestion_item/${id}`)
      .then((res) => {
        if(!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
