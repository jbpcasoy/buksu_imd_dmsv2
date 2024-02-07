import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useCoAuthoredIMs from "@/hooks/useCoAuthoredIMs";
import { useState } from "react";

export default function CoAuthoredIMsPage() {
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

  const { iMs, count } = useCoAuthoredIMs(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='My IM&apos;s'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
