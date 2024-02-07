import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { cITLIMsCount } from "../../citl/all_ims/count";
import { cITLDirectorEndorsedCount } from "../../citl/citl_director_endorsed/count";
import { cITLDirectorToEndorseCount } from "../../citl/citl_director_to_endorse/count";
import { cITLIDDEndorsedCount } from "../../citl/endorsed/count";
import { cITLReviewedCount } from "../../citl/reviewed/count";
import { cITLIDDToEndorseCount } from "../../citl/to_endorse/count";
import { cITLToReviewCount } from "../../citl/to_review/count";
import { cITLToReviseCount } from "../../citl/to_revise/count";
import { collegeIMsCount } from "../../college/all_ims/count";
import { deanEndorsedCount } from "../../college/endorsed/count";
import { deanToEndorseCount } from "../../college/to_endorse/count";
import { departmentIMsCount } from "../../department/all_ims/count";
import { coAuthoredIMsCount } from "../../department/co_authored/count";
import { coordinatorEndorsedCount } from "../../department/endorsed/count";
import { myIMsCount } from "../../department/my_ims/count";
import { reviewedCount } from "../../department/reviewed/count";
import { coordinatorToEndorseCount } from "../../department/to_endorse/count";
import { toReviewCount } from "../../department/to_review/count";
import { toReviseCount } from "../../department/to_revise/count";
import { iMERCCITLDirectorEndorsedCount } from "../../imerc/citl/citl_director_endorsed/count";
import { iMERCCITLDirectorToEndorseCount } from "../../imerc/citl/citl_director_to_endorse/count";
import { iMERCCITLEndorsedCount } from "../../imerc/citl/endorsed/count";
import { iMERCReviewedByCITLCount } from "../../imerc/citl/reviewed/count";
import { iMERCCITLToEndorseCount } from "../../imerc/citl/to_endorse/count";
import { iMERCCITLToReviewCount } from "../../imerc/citl/to_review/count";
import { iMERCCITLToReviseCount } from "../../imerc/citl/to_revise/count";
import { iMERCCollegeEndorsedCount } from "../../imerc/college/endorsed/count";
import { iMERCCollegeToEndorseCount } from "../../imerc/college/to_endorse/count";
import { iMERCEndorsedCount } from "../../imerc/department/endorsed/count";
import { iMERCReviewedCount } from "../../imerc/department/reviewed/count";
import { iMERCToEndorseCount } from "../../imerc/department/to_endorse/count";
import { iMERCToReviewCount } from "../../imerc/department/to_review/count";
import { iMERCToReviseCount } from "../../imerc/department/to_revise/count";

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
        counts.myIMsCount = await myIMsCount(user);
      } catch (error) {
        logger.error({ error });
        counts.myIMsCount = 0;
      }
      try {
        counts.coAuthoredIMsCount = await coAuthoredIMsCount(user);
      } catch (error) {
        logger.error({ error });
        counts.coAuthoredIMsCount = 0;
      }
      try {
        counts.departmentIMsCount = await departmentIMsCount(user);
      } catch (error) {
        logger.error({ error });
        counts.departmentIMsCount = 0;
      }
      try {
        counts.coordinatorToEndorseCount = await coordinatorToEndorseCount(
          user
        );
      } catch (error) {
        logger.error({ error });
        counts.coordinatorToEndorseCount = 0;
      }
      try {
        counts.deanToEndorseCount = await deanToEndorseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.deanToEndorseCount = 0;
      }
      try {
        counts.deanEndorsedCount = await deanEndorsedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.deanEndorsedCount = 0;
      }
      try {
        counts.toReviseCount = await toReviseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.toReviseCount = 0;
      }
      try {
        counts.toReviewCount = await toReviewCount(user);
      } catch (error) {
        logger.error({ error });
        counts.toReviewCount = 0;
      }
      try {
        counts.reviewedCount = await reviewedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.reviewedCount = 0;
      }
      try {
        counts.cITLToReviseCount = await cITLToReviseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.cITLToReviseCount = 0;
      }
      try {
        counts.cITLToReviewCount = await cITLToReviewCount(user);
      } catch (error) {
        logger.error({ error });
        counts.cITLToReviewCount = 0;
      }
      try {
        counts.cITLReviewedCount = await cITLReviewedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.cITLReviewedCount = 0;
      }
      try {
        counts.cITLIDDToEndorseCount = await cITLIDDToEndorseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.cITLIDDToEndorseCount = 0;
      }
      try {
        counts.cITLIDDEndorsedCount = await cITLIDDEndorsedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.cITLIDDEndorsedCount = 0;
      }
      try {
        counts.cITLIMsCount = await cITLIMsCount(user);
      } catch (error) {
        logger.error({ error });
        counts.cITLIMsCount = 0;
      }
      try {
        counts.cITLDirectorToEndorseCount = await cITLDirectorToEndorseCount(
          user
        );
      } catch (error) {
        logger.error({ error });
        counts.cITLDirectorToEndorseCount = 0;
      }
      try {
        counts.cITLDirectorEndorsedCount = await cITLDirectorEndorsedCount(
          user
        );
      } catch (error) {
        logger.error({ error });
        counts.cITLDirectorEndorsedCount = 0;
      }
      try {
        counts.iMERCToReviseCount = await iMERCToReviseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCToReviseCount = 0;
      }
      try {
        counts.iMERCToReviewCount = await iMERCToReviewCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCToReviewCount = 0;
      }
      try {
        counts.iMERCReviewedCount = await iMERCReviewedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCReviewedCount = 0;
      }
      try {
        counts.iMERCToEndorseCount = await iMERCToEndorseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCToEndorseCount = 0;
      }
      try {
        counts.iMERCEndorsedCount = await iMERCEndorsedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCEndorsedCount = 0;
      }
      try {
        counts.iMERCCollegeToEndorseCount = await iMERCCollegeToEndorseCount(
          user
        );
      } catch (error) {
        logger.error({ error });
        counts.iMERCCollegeToEndorseCount = 0;
      }
      try {
        counts.iMERCCollegeEndorsedCount = await iMERCCollegeEndorsedCount(
          user
        );
      } catch (error) {
        logger.error({ error });
        counts.iMERCCollegeEndorsedCount = 0;
      }
      try {
        counts.iMERCCITLToReviseCount = await iMERCCITLToReviseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLToReviseCount = 0;
      }
      try {
        counts.iMERCCITLToReviewCount = await iMERCCITLToReviewCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLToReviewCount = 0;
      }
      try {
        counts.iMERCReviewedByCITLCount = await iMERCReviewedByCITLCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCReviewedByCITLCount = 0;
      }
      try {
        counts.iMERCCITLToEndorseCount = await iMERCCITLToEndorseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLToEndorseCount = 0;
      }
      try {
        counts.iMERCCITLDirectorToEndorseCount =
          await iMERCCITLDirectorToEndorseCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLDirectorToEndorseCount = 0;
      }
      try {
        counts.iMERCCITLDirectorEndorsedCount =
          await iMERCCITLDirectorEndorsedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLDirectorEndorsedCount = 0;
      }
      try {
        counts.iMERCCITLEndorsedCount = await iMERCCITLEndorsedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.iMERCCITLEndorsedCount = 0;
      }
      try {
        counts.coordinatorEndorsedCount = await coordinatorEndorsedCount(user);
      } catch (error) {
        logger.error({ error });
        counts.coordinatorEndorsedCount = 0;
      }
      try {
        counts.collegeIMsCount = await collegeIMsCount(user);
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
