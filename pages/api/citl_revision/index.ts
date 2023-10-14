import prisma from "@/prisma/client";
import cITLRevisionAbility from "@/services/ability/cITLRevisionAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: User;

  try {
    user = await getServerUser(req, res);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = cITLRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iMFileId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "CITLRevision");

      const { iMFileId } = validator.cast(req.body);

      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          id: {
            equals: iMFileId,
          },
        },
      });

      const existingCITLRevision = await prisma.cITLRevision.findFirst({
        where: {
          AND: [
            {
              IMFile: {
                IM: {
                  id: {
                    equals: iMFile.iMId,
                  },
                },
              },
            },
            {
              returned: {
                equals: false,
              },
            },
          ],
        },
      });

      if (existingCITLRevision) {
        return res.status(400).json({
          error: { message: "IM has already been submitted for endorsement" },
        });
      }

      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.findFirstOrThrow({
          where: {
            AND: [
              {
                IDDCoordinatorSuggestion: {
                  DeanEndorsement: {
                    CoordinatorEndorsement: {
                      DepartmentRevision: {
                        DepartmentReviewed: {
                          SubmittedChairpersonSuggestion: {
                            ChairpersonSuggestion: {
                              ChairpersonReview: {
                                DepartmentReview: {
                                  IMFile: {
                                    IM: {
                                      id: {
                                        equals: iMFile.iMId,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              {
                IDDCoordinatorSuggestion: {
                  DeanEndorsement: {
                    CoordinatorEndorsement: {
                      DepartmentRevision: {
                        DepartmentReviewed: {
                          SubmittedCoordinatorSuggestion: {
                            CoordinatorSuggestion: {
                              CoordinatorReview: {
                                DepartmentReview: {
                                  IMFile: {
                                    IM: {
                                      id: {
                                        equals: iMFile.iMId,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              {
                IDDCoordinatorSuggestion: {
                  DeanEndorsement: {
                    CoordinatorEndorsement: {
                      DepartmentRevision: {
                        DepartmentReviewed: {
                          SubmittedPeerSuggestion: {
                            PeerSuggestion: {
                              PeerReview: {
                                DepartmentReview: {
                                  IMFile: {
                                    IM: {
                                      id: {
                                        equals: iMFile.iMId,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        });

      const cITLRevision = await prisma.cITLRevision.create({
        data: {
          IMFile: {
            connect: {
              id: iMFileId,
            },
          },
          SubmittedIDDCoordinatorSuggestion: {
            connect: {
              id: submittedIDDCoordinatorSuggestion.id,
            },
          },
        },
      });

      return res.json(cITLRevision);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);
      console.log({ filterName });
      const cITLRevisions = await prisma.cITLRevision.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).CITLRevision],
        },
      });
      const count = await prisma.cITLRevision.count({
        where: {
          AND: [accessibleBy(ability).CITLRevision],
        },
      });

      return res.json({ cITLRevisions, count });
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "POST":
      return await postHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
