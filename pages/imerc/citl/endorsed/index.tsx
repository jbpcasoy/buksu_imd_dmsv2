import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useIMERCCITLEndorsed from "@/hooks/useIMERCCITLEndorsed";
import { useState } from "react";

export default function IMERCCITLEndorsedPage() {
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

  const { iMs, count } = useIMERCCITLEndorsed(state);

  return (
    <IMTable
      count={count}
      iMs={iMs}
      title='Endorsed'
      onChangeState={(state) => setState(state)}
    />
  );
}