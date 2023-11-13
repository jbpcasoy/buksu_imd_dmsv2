import { useEffect, useState } from "react";
import { ProfilePictureFile } from "@prisma/client";
import axios from "axios";

export interface useProfilePictureFileParams {
  id: string;
}
export default function useProfilePictureFile({ id }: useProfilePictureFileParams) {
  const [state, setState] = useState<ProfilePictureFile | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/profile_picture_file/${id}`)
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
