import getServerUser from "@/services/getServerUser";
import {
  countCITLCITLDirectorEndorsedIMs,
  countCITLCITLDirectorToEndorseIMs,
  countCITLEndorsedIMs,
  countCITLIMs,
  countCITLReviewedIMs,
  countCITLToEndorseIMs,
  countCITLToReviewIMs,
  countCITLToReviseIMs,
  countCollegeEndorsedIMs,
  countCollegeIMs,
  countCollegeToEndorseIMs,
  countDepartmentCoAuthoredIMs,
  countDepartmentEndorsedIMs,
  countDepartmentIMs,
  countDepartmentReviewedIMs,
  countDepartmentToEndorseIMs,
  countDepartmentToReviewIMs,
  countDepartmentToReviseIMs,
  countIMERCCITLDirectorEndorsedIMs,
  countIMERCCITLDirectorToEndorseIMs,
  countIMERCCITLReviewedIMs,
  countIMERCCITLToEndorseIMs,
  countIMERCCITLToReviewIMs,
  countIMERCCITLToReviseIMs,
  countIMERCCollegeEndorsedIMs,
  countIMERCCollegeToEndorseIMs,
  countIMERCDepartmentEndorsedIMs,
  countIMERCDepartmentReviewedIMs,
  countIMERCDepartmentToEndorseIMs,
  countIMERCDepartmentToReviewIMs,
  countIMERCDepartmentToReviseIMs,
  countMyIMs,
} from "@/services/iMService";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: User;

  try {
    user = await getServerUser(req, res);
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    try {
      const counts = {
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
      };

      try {
        counts.myIMsCount = await countMyIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.myIMsCount = 0;
      }
      try {
        counts.coAuthoredIMsCount = await countDepartmentCoAuthoredIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.coAuthoredIMsCount = 0;
      }
      try {
        counts.departmentIMsCount = await countDepartmentIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.departmentIMsCount = 0;
      }
      try {
        counts.coordinatorToEndorseCount = await countDepartmentToEndorseIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.coordinatorToEndorseCount = 0;
      }
      try {
        counts.deanToEndorseCount = await countCollegeToEndorseIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.deanToEndorseCount = 0;
      }
      try {
        counts.deanEndorsedCount = await countCollegeEndorsedIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.deanEndorsedCount = 0;
      }
      try {
        counts.toReviseCount = await countDepartmentToReviseIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.toReviseCount = 0;
      }
      try {
        counts.toReviewCount = await countDepartmentToReviewIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.toReviewCount = 0;
      }
      try {
        counts.reviewedCount = await countDepartmentReviewedIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.reviewedCount = 0;
      }
      try {
        counts.cITLToReviseCount = await countCITLToReviseIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.cITLToReviseCount = 0;
      }
      try {
        counts.cITLToReviewCount = await countCITLToReviewIMs();
      } catch (error) {
        logger.error({ error });
        counts.cITLToReviewCount = 0;
      }
      try {
        counts.cITLReviewedCount = await countCITLReviewedIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.cITLReviewedCount = 0;
      }
      try {
        counts.cITLIDDToEndorseCount = await countCITLToEndorseIMs();
      } catch (error) {
        logger.error({ error });
        counts.cITLIDDToEndorseCount = 0;
      }
      try {
        counts.cITLIDDEndorsedCount = await countCITLEndorsedIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.cITLIDDEndorsedCount = 0;
      }
      try {
        counts.cITLIMsCount = await countCITLIMs();
      } catch (error) {
        logger.error({ error });
        counts.cITLIMsCount = 0;
      }
      try {
        counts.cITLDirectorToEndorseCount =
          await countCITLCITLDirectorToEndorseIMs();
      } catch (error) {
        logger.error({ error });
        counts.cITLDirectorToEndorseCount = 0;
      }
      try {
        counts.cITLDirectorEndorsedCount =
          await countCITLCITLDirectorEndorsedIMs({
            user,
          });
      } catch (error) {
        logger.error({ error });
        counts.cITLDirectorEndorsedCount = 0;
      }
      try {
        counts.iMERCToReviseCount = await countIMERCDepartmentToReviseIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCToReviseCount = 0;
      }
      try {
        counts.iMERCToReviewCount = await countIMERCDepartmentToReviewIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCToReviewCount = 0;
      }
      try {
        counts.iMERCReviewedCount = await countIMERCDepartmentReviewedIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCReviewedCount = 0;
      }
      try {
        counts.iMERCToEndorseCount = await countIMERCDepartmentToEndorseIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCToEndorseCount = 0;
      }
      try {
        counts.iMERCEndorsedCount = await countIMERCDepartmentEndorsedIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCEndorsedCount = 0;
      }
      try {
        counts.iMERCCollegeToEndorseCount = await countIMERCCollegeToEndorseIMs(
          { user }
        );
      } catch (error) {
        logger.error({ error });
        counts.iMERCCollegeToEndorseCount = 0;
      }
      try {
        counts.iMERCCollegeEndorsedCount = await countIMERCCollegeEndorsedIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCCollegeEndorsedCount = 0;
      }
      try {
        counts.iMERCCITLToReviseCount = await countIMERCCITLToReviseIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLToReviseCount = 0;
      }
      try {
        counts.iMERCCITLToReviewCount = await countIMERCCITLToReviewIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLToReviewCount = 0;
      }
      try {
        counts.iMERCReviewedByCITLCount = await countIMERCCITLReviewedIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.iMERCReviewedByCITLCount = 0;
      }
      try {
        counts.iMERCCITLToEndorseCount = await countIMERCCITLToEndorseIMs();
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLToEndorseCount = 0;
      }
      try {
        counts.iMERCCITLDirectorToEndorseCount =
          await countIMERCCITLDirectorToEndorseIMs();
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLDirectorToEndorseCount = 0;
      }
      try {
        counts.iMERCCITLDirectorEndorsedCount =
          await countIMERCCITLDirectorEndorsedIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLDirectorEndorsedCount = 0;
      }
      try {
        counts.iMERCCITLEndorsedCount = await countIMERCCITLToEndorseIMs();
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLEndorsedCount = 0;
      }
      try {
        counts.coordinatorEndorsedCount = await countDepartmentEndorsedIMs({
          user,
        });
      } catch (error) {
        logger.error({ error });
        counts.coordinatorEndorsedCount = 0;
      }
      try {
        counts.collegeIMsCount = await countCollegeIMs({ user });
      } catch (error) {
        logger.error({ error });
        counts.collegeIMsCount = 0;
      }

      return res.json(counts);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
