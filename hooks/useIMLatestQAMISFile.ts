import { IDDCoordinatorSuggestionItem, QAMISFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMLatestQAMISFileParams {
  id?: string;
}
export default function useIMLatestQAMISFile({ id }: useIMLatestQAMISFileParams) {
  const [state, setState] = useState<QAMISFile>();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`/api/qamis_file/im/${id}`)
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return state;
}
