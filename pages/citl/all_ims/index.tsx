import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useCITLIMs from "@/hooks/useCITLIMs";
import { useState } from "react";

export default function CITLIMsPage() {
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

  const { iMs, count } = useCITLIMs(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='All IM&apos;s'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}