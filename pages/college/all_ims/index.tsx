import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useCollegeIMs from "@/hooks/useCollegeIMs";
import { useState } from "react";

export default function CollegeIMsPage() {
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

  const { iMs, count } = useCollegeIMs(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.COLLEGE_IMS} />}
        count={count}
        iMs={iMs}
        title="College IMs"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
