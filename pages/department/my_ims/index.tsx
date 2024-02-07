import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useMyIMs from "@/hooks/useMyIMs";
import { useState } from "react";

export default function MyIMsPage() {
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

  const { iMs, count } = useMyIMs(state);

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
