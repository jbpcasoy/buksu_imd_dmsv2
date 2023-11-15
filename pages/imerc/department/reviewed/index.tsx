import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useIMERCReviewed from "@/hooks/useIMERCReviewed";
import { useState } from "react";

export default function IMERCReviewedPage() {
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

  const { iMs, count } = useIMERCReviewed(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='Reviewed'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}