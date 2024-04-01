import { Syllabus } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

interface useSyllabusProps {
  id: string;
  refreshFlag?: number;
}
export default function useSyllabus({ id, refreshFlag }: useSyllabusProps) {
  const [state, setState] = useState<Syllabus | null>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/syllabus/${id}`)
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
  }, [id, refreshFlag]);

  return state;
}
