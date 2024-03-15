import { ReturnedDepartmentRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedDepartmentRevisionSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useReturnedDepartmentRevisionSuggestionItemsIM({
  skip,
  take,
  id,
}: useReturnedDepartmentRevisionSuggestionItemsIMParams) {
  const [state, setState] = useState<{
    returnedDepartmentRevisionSuggestionItems: ReturnedDepartmentRevisionSuggestionItem[];
    count: number;
  }>({
    count: 0,
    returnedDepartmentRevisionSuggestionItems: [],
  });

  useEffect(() => {
    console.log({ skip, take, id });
    if (!id) {
      return;
    }
    axios
      .get(`/api/returned_department_revision_suggestion_item/im/${id}`, {
        params: {
          skip,
          take,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, id]);

  return state;
}
