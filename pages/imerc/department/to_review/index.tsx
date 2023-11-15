import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useIMERCToReview from "@/hooks/useIMERCToReview";
import { useState } from "react";

export default function IMERCToReviewPage() {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    filter: {
      title: "",
      userName: "",
      departmentName: "",
      collegeName: "",
    },
    sort: {
      field: "createdAt",
      direction: "desc",
    },
  });

  const { iMs, count } = useIMERCToReview(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='To Review'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}