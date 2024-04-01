import { SyllabusFile } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

interface useSyllabusFileProps {
  id?: string;
}
export default function useSyllabusFile({ id }: useSyllabusFileProps) {
  const [state, setState] = useState<SyllabusFile | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/syllabus_file/${id}`)
      .then((res) => {
        if (subscribe) {
          setState(res.data);
        }
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
