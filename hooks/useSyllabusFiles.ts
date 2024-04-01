import { SyllabusFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

interface useSyllabusFileProps {
  skip: number;
  take: number;
}
export default function useSyllabusFiles({ skip, take }: useSyllabusFileProps) {
  const [state, setState] = useState<{
    syllabusFiles: SyllabusFile[];
    count: number;
  }>({
    count: 0,
    syllabusFiles: [],
  });

  useEffect(() => {
    axios
      .get("/api/syllabus_file/", {
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
  }, [skip, take]);

  return state;
}
