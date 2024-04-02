import { SyllabusDepartmentReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

interface useSyllabusDepartmentReviewProps {
  id?: string;
}

export default function useSyllabusDepartmentReview({
  id,
}: useSyllabusDepartmentReviewProps) {
  const [state, setState] = useState<SyllabusDepartmentReview | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/syllabus_department_review/${id}`)
      .then((res) => {
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
