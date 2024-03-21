import { ReturnedDepartmentRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedDepartmentRevisionSuggestionItemParams {
  id: string;
}
export default function useReturnedDepartmentRevisionSuggestionItem({
  id,
}: useReturnedDepartmentRevisionSuggestionItemParams) {
  const [state, setState] =
    useState<ReturnedDepartmentRevisionSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_department_revision_suggestion_item/${id}`)
      .then((res) => {
        if (!subscribe) return;
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
