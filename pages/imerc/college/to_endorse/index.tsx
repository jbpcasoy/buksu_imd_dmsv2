import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useIMERCCollegeToEndorse from "@/hooks/useIMERCCollegeToEndorse";
import { useState } from "react";

export default function IMERCCollegeToEndorsePage() {
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

  const { iMs, count } = useIMERCCollegeToEndorse(state);

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