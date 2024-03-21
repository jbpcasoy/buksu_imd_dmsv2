import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useCITLToReview from "@/hooks/useCITLToReview";
import { useState } from "react";

export default function CITLToReviewPage() {
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

  const { iMs, count } = useCITLToReview(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVIEW} />}
        count={count}
        iMs={iMs}
        title="To Review"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
