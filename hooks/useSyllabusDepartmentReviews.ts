import { SyllabusDepartmentReview } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

interface useSyllabusDepartmentReviewsProps {
  skip: number;
  take: number;
}

export default function useSyllabusDepartmentReviews({
  skip,
  take,
}: useSyllabusDepartmentReviewsProps) {
  const [state, setState] = useState<{
    syllabusDepartmentReviews: SyllabusDepartmentReview[];
    count: number;
  }>({
    count: 0,
    syllabusDepartmentReviews: [],
  });

  useEffect(() => {
    let subscribe = true;

    axios
      .get(`/api/syllabus_department_review`, {
        params: {
          skip,
          take,
        },
      })
      .then((res) => {
        if (!subscribe) return;

        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      subscribe = false;
    };
  }, [skip, take]);

  return state;
}
