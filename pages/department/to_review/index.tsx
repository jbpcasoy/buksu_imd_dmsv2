import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useToReview from "@/hooks/useToReview";
import { useState } from "react";

export default function ToReviewPage() {
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
    }
  });

  const { iMs, count } = useToReview(state);

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
