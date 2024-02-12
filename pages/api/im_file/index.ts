import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import uploadToVercelBlob from "@/services/uploadToVercelBlob";
import { User } from "@prisma/client";
import { Fields, Formidable } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as Yup from "yup";

//set bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

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

  /** TODO add post blockers only allow im file upload when:
   * IM is in status of:
   * IMPLEMENTATION_DRAFT
   * IMPLEMENTATION_DEPARTMENT_REVIEWED
   * IMPLEMENTATION_CITL_REVIEWED
   * IMPLEMENTATION_CITL_DIRECTOR_ENDORSED
   * IMERC_CITL_REVIEWED
   */
  const postHandler = async () => {
    try {
      // Read body using formidable
      const data: any = await new Promise((resolve, reject) => {
        const form = new Formidable();
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject({ err });
          }
          resolve({ err, fields, files });
        });
      });
      // Parse request body
      const fields: Fields = data.fields;
      const body = {
        iMId: fields?.iMId?.at(0),
        departmentReviewedId: fields?.departmentReviewedId?.at(0),
        submittedReturnedDepartmentRevisionId:
          fields?.submittedReturnedDepartmentRevisionId?.at(0),
        submittedIDDCoordinatorSuggestionId:
          fields?.submittedIDDCoordinatorSuggestionId?.at(0),
        submittedReturnedCITLRevisionId:
          fields?.submittedReturnedCITLRevisionId?.at(0),
        submittedQAMISSuggestionId: fields?.submittedQAMISSuggestionId?.at(0),
        iMERCCITLReviewedId: fields?.iMERCCITLReviewedId?.at(0),
        submittedReturnedIMERCCITLRevisionId:
          fields?.submittedReturnedIMERCCITLRevisionId?.at(0),
      };
      // Validate request body
      const validator = Yup.object({
        iMId: Yup.string().required(),
        departmentReviewedId: Yup.string(),
        submittedReturnedDepartmentRevisionId: Yup.string(),
        submittedIDDCoordinatorSuggestionId: Yup.string(),
        submittedReturnedCITLRevisionId: Yup.string(),
        submittedQAMISSuggestionId: Yup.string(),
        iMERCCITLReviewedId: Yup.string(),
        submittedReturnedIMERCCITLRevisionId: Yup.string(),
      });
      await validator.validate(body);
      const {
        iMId,
        departmentReviewedId,
        submittedReturnedDepartmentRevisionId,
        submittedIDDCoordinatorSuggestionId,
        submittedReturnedCITLRevisionId,
        submittedQAMISSuggestionId,
        iMERCCITLReviewedId,
        submittedReturnedIMERCCITLRevisionId,
      } = validator.cast(body);

      const iM = await prisma.iM.findFirstOrThrow({
        where: {
          id: {
            equals: iMId as string,
          },
        },
      });

      if (!user.isAdmin) {
        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });
        if (!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active faculty can perform this action",
            },
          });
        }
        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to submit a file for this IM",
            },
          });
        }
      }

      if (
        !departmentReviewedId &&
        !submittedReturnedDepartmentRevisionId &&
        !submittedIDDCoordinatorSuggestionId &&
        !submittedReturnedCITLRevisionId &&
        !submittedQAMISSuggestionId &&
        !iMERCCITLReviewedId &&
        !submittedReturnedIMERCCITLRevisionId
      ) {
        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res
            .status(400)
            .json({ error: { message: "IM already had a file" } });
        }
      } else if (departmentReviewedId) {
        const existingIMFileWithEmptyActionTaken =
          await prisma.iMFile.findFirst({
            where: {
              AND: [
                {
                  iMId: {
                    equals: iMId,
                  },
                },
                {
                  DepartmentReview: {
                    OR: [
                      {
                        ChairpersonReview: {
                          ChairpersonSuggestion: {
                            SubmittedChairpersonSuggestion: {
                              ChairpersonSuggestion: {
                                AND: [
                                  {
                                    ChairpersonSuggestionItem: {
                                      some: {},
                                    },
                                  },
                                  {
                                    ChairpersonSuggestionItem: {
                                      some: {
                                        ChairpersonSuggestionItemActionTaken: {
                                          is: null,
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                      {
                        CoordinatorReview: {
                          CoordinatorSuggestion: {
                            SubmittedCoordinatorSuggestion: {
                              CoordinatorSuggestion: {
                                AND: [
                                  {
                                    CoordinatorSuggestionItem: {
                                      some: {},
                                    },
                                  },
                                  {
                                    CoordinatorSuggestionItem: {
                                      some: {
                                        CoordinatorSuggestionItemActionTaken: {
                                          is: null,
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                      {
                        PeerReview: {
                          PeerSuggestion: {
                            SubmittedPeerSuggestion: {
                              PeerSuggestion: {
                                AND: [
                                  {
                                    PeerSuggestionItem: {
                                      some: {},
                                    },
                                  },
                                  {
                                    PeerSuggestionItem: {
                                      some: {
                                        PeerSuggestionItemActionTaken: {
                                          is: null,
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          });

        if (existingIMFileWithEmptyActionTaken) {
          return res.status(400).json({
            error: { message: "IM have empty action taken" },
          });
        }

        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
              {
                DepartmentReviewed: {
                  id: {
                    equals: departmentReviewedId,
                  },
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res.status(400).json({
            error: { message: "IM already had a department revision file" },
          });
        }
      } else if (submittedReturnedDepartmentRevisionId) {
        const existingIMFileWithEmptyActionTaken =
          await prisma.iMFile.findFirst({
            where: {
              AND: [
                {
                  iMId: {
                    equals: iMId,
                  },
                },
                {
                  DepartmentRevision: {
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: {
                        ReturnedDepartmentRevision: {
                          AND: [
                            {
                              ReturnedDepartmentRevisionSuggestionItem: {
                                some: {},
                              },
                            },
                            {
                              ReturnedDepartmentRevisionSuggestionItem: {
                                some: {
                                  ReturnedDepartmentRevisionSuggestionItemActionTaken:
                                    {
                                      is: null,
                                    },
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              ],
            },
          });

        if (existingIMFileWithEmptyActionTaken) {
          return res.status(400).json({
            error: { message: "IM have empty action taken" },
          });
        }
        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
              {
                SubmittedReturnedDepartmentRevision: {
                  id: {
                    equals: submittedReturnedDepartmentRevisionId,
                  },
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res.status(400).json({
            error: {
              message: "IM already had a returned department revision file",
            },
          });
        }
      } else if (submittedIDDCoordinatorSuggestionId) {
        const existingIMFileWithEmptyActionTaken =
          await prisma.iMFile.findFirst({
            where: {
              AND: [
                {
                  iMId: {
                    equals: iMId,
                  },
                },
                {
                  DepartmentRevision: {
                    CoordinatorEndorsement: {
                      DeanEndorsement: {
                        IDDCoordinatorSuggestion: {
                          SubmittedIDDCoordinatorSuggestion: {
                            IDDCoordinatorSuggestion: {
                              AND: [
                                {
                                  IDDCoordinatorSuggestionItem: {
                                    some: {},
                                  },
                                },
                                {
                                  IDDCoordinatorSuggestionItem: {
                                    some: {
                                      IDDCoordinatorSuggestionItemActionTaken: {
                                        is: null,
                                      },
                                    },
                                  },
                                },
                              ],
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

        if (existingIMFileWithEmptyActionTaken) {
          return res.status(400).json({
            error: { message: "IM have empty action taken" },
          });
        }
        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
              {
                SubmittedIDDCoordinatorSuggestion: {
                  id: {
                    equals: submittedIDDCoordinatorSuggestionId,
                  },
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res.status(400).json({
            error: { message: "IM already had a CITL revision file" },
          });
        }
      } else if (submittedReturnedCITLRevisionId) {
        const existingIMFileWithEmptyActionTaken =
          await prisma.iMFile.findFirst({
            where: {
              AND: [
                {
                  iMId: {
                    equals: iMId,
                  },
                },
                {
                  CITLRevision: {
                    ReturnedCITLRevision: {
                      SubmittedReturnedCITLRevision: {
                        ReturnedCITLRevision: {
                          AND: [
                            {
                              ReturnedCITLRevisionSuggestionItem: {
                                some: {},
                              },
                            },
                            {
                              ReturnedCITLRevisionSuggestionItem: {
                                some: {
                                  ReturnedCITLRevisionSuggestionItemActionTaken:
                                    {
                                      is: null,
                                    },
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              ],
            },
          });

        if (existingIMFileWithEmptyActionTaken) {
          return res.status(400).json({
            error: {
              message: "IM have empty action taken",
            },
          });
        }
        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
              {
                SubmittedReturnedCITLRevision: {
                  id: {
                    equals: submittedReturnedCITLRevisionId,
                  },
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res.status(400).json({
            error: {
              message: "IM already had a returned citl revision file",
            },
          });
        }
      } else if (submittedQAMISSuggestionId) {
        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
              {
                SubmittedQAMISSuggestion: {
                  id: {
                    equals: submittedQAMISSuggestionId,
                  },
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res.status(400).json({
            error: { message: "IM already had a QAMIS revision file" },
          });
        }
      } else if (iMERCCITLReviewedId) {
        const existingIMFileWithEmptyActionTaken =
          await prisma.iMFile.findFirst({
            where: {
              AND: [
                {
                  iMId: {
                    equals: iMId,
                  },
                },
                {
                  QAMISRevision: {
                    QAMISDeanEndorsement: {
                      QAMISDepartmentEndorsement: {
                        OR: [
                          {
                            ContentEditorReview: {
                              ContentEditorSuggestion: {
                                SubmittedContentEditorSuggestion: {
                                  ContentEditorSuggestion: {
                                    AND: [
                                      {
                                        ContentEditorSuggestionItem: {
                                          some: {},
                                        },
                                      },
                                      {
                                        ContentEditorSuggestionItem: {
                                          some: {
                                            ContentEditorSuggestionItemActionTaken:
                                              {
                                                is: null,
                                              },
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          },
                          {
                            ContentSpecialistReview: {
                              ContentSpecialistSuggestion: {
                                SubmittedContentSpecialistSuggestion: {
                                  ContentSpecialistSuggestion: {
                                    AND: [
                                      {
                                        ContentSpecialistSuggestionItem: {
                                          some: {},
                                        },
                                      },
                                      {
                                        ContentSpecialistSuggestionItem: {
                                          some: {
                                            ContentSpecialistSuggestionItemActionTaken:
                                              {
                                                is: null,
                                              },
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          },
                          {
                            IDDSpecialistReview: {
                              IDDSpecialistSuggestion: {
                                SubmittedIDDSpecialistSuggestion: {
                                  IDDSpecialistSuggestion: {
                                    AND: [
                                      {
                                        IDDSpecialistSuggestionItem: {
                                          some: {},
                                        },
                                      },
                                      {
                                        IDDSpecialistSuggestionItem: {
                                          some: {
                                            IDDSpecialistSuggestionItemActionTaken:
                                              {
                                                is: null,
                                              },
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          });

        if (existingIMFileWithEmptyActionTaken) {
          return res.status(400).json({
            error: { message: "IM have empty action taken" },
          });
        }
        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
              {
                IMERCCITLReviewed: {
                  id: {
                    equals: iMERCCITLReviewedId,
                  },
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res.status(400).json({
            error: { message: "IM already had an IMERC CITL revision file" },
          });
        }
      } else if (submittedReturnedIMERCCITLRevisionId) {
        const existingIMFileWithEmptyActionTaken =
          await prisma.iMFile.findFirst({
            where: {
              AND: [
                {
                  iMId: {
                    equals: iMId,
                  },
                },
                {
                  IMERCCITLRevision: {
                    ReturnedIMERCCITLRevision: {
                      SubmittedReturnedIMERCCITLRevision: {
                        ReturnedIMERCCITLRevision: {
                          AND: [
                            {
                              ReturnedIMERCCITLRevisionSuggestionItem: {
                                some: {},
                              },
                            },
                            {
                              ReturnedIMERCCITLRevisionSuggestionItem: {
                                some: {
                                  ReturnedIMERCCITLRevisionSuggestionItemActionTaken:
                                    {
                                      is: null,
                                    },
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              ],
            },
          });

        if (existingIMFileWithEmptyActionTaken) {
          return res.status(400).json({
            error: {
              message: "IM have empty action taken",
            },
          });
        }
        const existingIMFile = await prisma.iMFile.findFirst({
          where: {
            AND: [
              {
                iMId: {
                  equals: iMId,
                },
              },
              {
                SubmittedReturnedIMERCCITLRevision: {
                  id: {
                    equals: submittedReturnedIMERCCITLRevisionId,
                  },
                },
              },
            ],
          },
        });

        if (existingIMFile) {
          return res.status(400).json({
            error: {
              message: "IM already had a returned IMERC CITL revision file",
            },
          });
        }
      }

      // Save file to server
      const file = data.files.file[0];
      const filename = `${file.newFilename}.pdf`;
      // const filePath = file.filepath;
      // const destination = path.join(process.cwd(), `/files/im/${filename}`);
      // fs.copyFile(filePath, destination, (err) => {
      //   if (err) throw err;
      // });
      const blob = await uploadToVercelBlob(file, `files/im/${filename}`);
      const blobFilename = blob.url.split("/").at(-1);
      console.log({ blob });

      // create object to server
      const iMFile = await prisma.iMFile.create({
        data: {
          IM: {
            connect: {
              id: iM.id,
            },
          },
          DepartmentReviewed: departmentReviewedId
            ? {
                connect: {
                  id: departmentReviewedId,
                },
              }
            : undefined,
          SubmittedReturnedDepartmentRevision:
            submittedReturnedDepartmentRevisionId
              ? {
                  connect: {
                    id: submittedReturnedDepartmentRevisionId,
                  },
                }
              : undefined,
          SubmittedIDDCoordinatorSuggestion: submittedIDDCoordinatorSuggestionId
            ? {
                connect: {
                  id: submittedIDDCoordinatorSuggestionId,
                },
              }
            : undefined,
          SubmittedReturnedCITLRevision: submittedReturnedCITLRevisionId
            ? {
                connect: {
                  id: submittedReturnedCITLRevisionId,
                },
              }
            : undefined,
          SubmittedQAMISSuggestion: submittedQAMISSuggestionId
            ? {
                connect: {
                  id: submittedQAMISSuggestionId,
                },
              }
            : undefined,
          IMERCCITLReviewed: iMERCCITLReviewedId
            ? {
                connect: {
                  id: iMERCCITLReviewedId,
                },
              }
            : undefined,
          SubmittedReturnedIMERCCITLRevision:
            submittedReturnedIMERCCITLRevisionId
              ? {
                  connect: {
                    id: submittedReturnedIMERCCITLRevisionId,
                  },
                }
              : undefined,
          filename: blobFilename as string,
          mimetype: file.mimetype,
          size: file.size,
          originalFilename: file.originalFilename,
        },
      });
      res.status(200).json(iMFile);
    } catch (error: any) {
      logger.error(error);
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
        "filter[iMId]": Yup.string().optional(),
      });
      await validator.validate(req.query);
      const {
        skip,
        take,
        "filter[iMId]": filterIMId,
      } = validator.cast(req.query);

      const iMFiles = await prisma.iMFile.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              IM: {
                id: {
                  contains: filterIMId ?? "",
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.iMFile.count({
        where: {},
      });

      return res.json({ iMFiles, count });
    } catch (error: any) {
      logger.error(error);
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
