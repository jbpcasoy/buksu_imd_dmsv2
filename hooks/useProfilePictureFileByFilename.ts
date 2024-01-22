import { ProfilePictureFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useProfilePictureFileByFilenameParams {
  filename?: string;
}
export default function useProfilePictureFileByFilename({
  filename,
}: useProfilePictureFileByFilenameParams) {
  const [state, setState] = useState<ProfilePictureFile | null>();

  useEffect(() => {
    if (!filename) return;

    let subscribe = true;

    axios
      .get(`/api/profile_picture_file/by_filename/${filename}`)
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
  }, [filename]);

  return state;
}
