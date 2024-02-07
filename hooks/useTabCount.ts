import axios from "axios";
import { useEffect, useState } from "react";

export default function useTabCount() {
  const [state, setState] = useState<{
    myIMsCount: number;
    coAuthoredIMsCount: number;
    departmentIMsCount: number;
    coordinatorToEndorseCount: number;
    deanToEndorseCount: number;
    deanEndorsedCount: number;
    toReviseCount: number;
    toReviewCount: number;
    reviewedCount: number;
    cITLToReviseCount: number;
    cITLToReviewCount: number;
    cITLReviewedCount: number;
    cITLIDDToEndorseCount: number;
    cITLIDDEndorsedCount: number;
    cITLIMsCount: number;
    cITLDirectorToEndorseCount: number;
    cITLDirectorEndorsedCount: number;
    iMERCToReviseCount: number;
    iMERCToReviewCount: number;
    iMERCReviewedCount: number;
    iMERCToEndorseCount: number;
    iMERCEndorsedCount: number;
    iMERCCollegeToEndorseCount: number;
    iMERCCollegeEndorsedCount: number;
    iMERCCITLToReviseCount: number;
    iMERCCITLToReviewCount: number;
    iMERCReviewedByCITLCount: number;
    iMERCCITLToEndorseCount: number;
    iMERCCITLDirectorToEndorseCount: number;
    iMERCCITLDirectorEndorsedCount: number;
    iMERCCITLEndorsedCount: number;
    coordinatorEndorsedCount: number;
    collegeIMsCount: number;
  }>({
    myIMsCount: 0,
    coAuthoredIMsCount: 0,
    departmentIMsCount: 0,
    coordinatorToEndorseCount: 0,
    deanToEndorseCount: 0,
    deanEndorsedCount: 0,
    toReviseCount: 0,
    toReviewCount: 0,
    reviewedCount: 0,
    cITLToReviseCount: 0,
    cITLToReviewCount: 0,
    cITLReviewedCount: 0,
    cITLIDDToEndorseCount: 0,
    cITLIDDEndorsedCount: 0,
    cITLIMsCount: 0,
    cITLDirectorToEndorseCount: 0,
    cITLDirectorEndorsedCount: 0,
    iMERCToReviseCount: 0,
    iMERCToReviewCount: 0,
    iMERCReviewedCount: 0,
    iMERCToEndorseCount: 0,
    iMERCEndorsedCount: 0,
    iMERCCollegeToEndorseCount: 0,
    iMERCCollegeEndorsedCount: 0,
    iMERCCITLToReviseCount: 0,
    iMERCCITLToReviewCount: 0,
    iMERCReviewedByCITLCount: 0,
    iMERCCITLToEndorseCount: 0,
    iMERCCITLDirectorToEndorseCount: 0,
    iMERCCITLDirectorEndorsedCount: 0,
    iMERCCITLEndorsedCount: 0,
    coordinatorEndorsedCount: 0,
    collegeIMsCount: 0,
  });

  useEffect(() => {
    axios
      .get("/api/im/count/tab_count")
      .then((res) => {
        console.log({ res });
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return state;
}
