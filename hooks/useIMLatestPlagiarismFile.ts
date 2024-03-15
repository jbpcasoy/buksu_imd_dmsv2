import { PlagiarismFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMLatestPlagiarismFileParams {
  id?: string;
}
export default function useIMLatestPlagiarismFile({
  id,
}: useIMLatestPlagiarismFileParams) {
  const [state, setState] = useState<PlagiarismFile>();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`/api/plagiarism_file/im/${id}`)
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return state;
}
