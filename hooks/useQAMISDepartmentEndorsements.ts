import { QAMISDepartmentEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISDepartmentEndorsementsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useQAMISDepartmentEndorsements({ skip, take, filter }: useQAMISDepartmentEndorsementsParams) {
  const [state, setState] = useState<{qAMISDepartmentEndorsements: QAMISDepartmentEndorsement[], count: number}>({
    count: 0,
    qAMISDepartmentEndorsements: []
  });

  useEffect(() => {
    axios
      .get("/api/qamis_department_endorsement", {
        params: {
          skip,
          take,
          filter
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter]);

  return state;
}
