import { IMFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIMLatestIMFileParams {
  id?: string;
}
export default function useIMLatestIMFile({ id }: useIMLatestIMFileParams) {
  const [state, setState] = useState<IMFile>();

  useEffect(() => {
    if (!id) {
      return;
    }

    axios
      .get(`/api/im_file/im/${id}`)
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return state;
}
