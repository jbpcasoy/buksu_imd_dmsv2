import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useDepartmentIMs from "@/hooks/useDepartmentIMs";
import { useState } from "react";

export default function DepartmentIMsPage() {
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

  const { iMs, count } = useDepartmentIMs(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.DEPARTMENT_IMS} />}
        count={count}
        iMs={iMs}
        title='Department IM&apos;s'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
