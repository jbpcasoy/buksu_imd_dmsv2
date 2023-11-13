import { ProfilePictureFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useProfilePictureFilesParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useProfilePictureFiles({ skip, take, filter }: useProfilePictureFilesParams) {
  const [state, setState] = useState<{profilePictureFiles: ProfilePictureFile[], count: number}>({
    count: 0,
    profilePictureFiles: []
  });

  useEffect(() => {
    axios
      .get("/api/profile_picture_file", {
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
