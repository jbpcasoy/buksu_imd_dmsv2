import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useCITLIDDToEndorse from "@/hooks/useCITLIDDToEndorse";
import { useState } from "react";

export default function CITLIDDToEndorsePage() {
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

  const { iMs, count } = useCITLIDDToEndorse(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='To Endorse'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
