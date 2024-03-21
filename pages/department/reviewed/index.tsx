import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useReviewed from "@/hooks/useReviewed";
import { useState } from "react";

export default function ReviewedPage() {
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

  const { iMs, count } = useReviewed(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.REVIEWED} />}
        count={count}
        iMs={iMs}
        title="Reviewed"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
