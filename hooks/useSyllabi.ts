import { Syllabus } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

interface useSyllabiProps {
  skip: number;
  take: number;
}
export default function useSyllabi({ skip, take }: useSyllabiProps) {
  const [state, setState] = useState<{
    syllabi: Syllabus[];
    count: number;
  }>({
    count: 0,
    syllabi: [],
  });

  useEffect(() => {
    axios
      .get("/api/syllabus", {
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
