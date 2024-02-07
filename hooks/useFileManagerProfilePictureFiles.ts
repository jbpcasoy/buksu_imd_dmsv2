import FileMetadata from "@/constants/FileMetadata";
import axios from "axios";
import { useEffect, useState } from "react";

interface UseFileManagerProfilePictureFilesProps {
  skip: number;
  take: number;
  filter?: object;
}

export default function useFileManagerProfilePictureFiles({skip, take, filter}: UseFileManagerProfilePictureFilesProps) {
    const [state, setState] = useState<{fileMetadatas: FileMetadata[], count: number}>({
        count: 0,
        fileMetadatas: []
      });
    
      useEffect(() => {
        axios
          .get("/api/file_manager/profile_picture", {
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
