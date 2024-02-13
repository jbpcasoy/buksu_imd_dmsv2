import FileMetadata from "@/constants/FileMetadata";
import { ListBlobResultBlob } from "@vercel/blob";
import axios from "axios";
import { useEffect, useState } from "react";

interface UseFileManagerProfilePictureFileProps {
  filename?: string;
}

export default function useFileManagerProfilePictureFile({
  filename,
}: UseFileManagerProfilePictureFileProps) {
  const [state, setState] = useState<ListBlobResultBlob | null>();

  useEffect(() => {
    if (!filename) {
      return;
    }

    axios
      .get(`/api/file_manager/profile_picture/${filename}`)
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        setState(null);
        console.error(error);
      });
  }, [filename]);

  return state;
}
