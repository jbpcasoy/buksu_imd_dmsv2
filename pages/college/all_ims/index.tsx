import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
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
    }
  });

  const { iMs, count } = useCollegeIMs(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='College IM&apos;s'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}