import { QAMISChairpersonEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useFacultiesParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useQAMISChairpersonEndorsements({
  skip,
  take,
  filter,
}: useFacultiesParams) {
  const [state, setState] = useState<{
    qAMISChairpersonEndorsements: QAMISChairpersonEndorsement[];
    count: number;
  }>({
    count: 0,
    qAMISChairpersonEndorsements: [],
  });

  useEffect(() => {
    axios
      .get("/api/qamis_chairperson_endorsement", {
        params: {
          skip,
          take,
          filter,
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
