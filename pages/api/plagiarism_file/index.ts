import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { Fields, Formidable } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
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
        iMERCCITLReviewedId: fields?.iMERCCITLReviewedId?.at(0),
      };
      // Validate request body
      const validator = Yup.object({
        iMERCCITLReviewedId: Yup.string().required(),
      });
      await validator.validate(body);
      const { iMERCCITLReviewedId } = validator.cast(body);

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  IMFile: {
                                                    QAMISRevision: {
                                                      QAMISDeanEndorsement: {
                                                        QAMISDepartmentEndorsement:
                                                          {
                                                            ContentEditorReview:
                                                              {
                                                                ContentEditorSuggestion:
                                                                  {
                                                                    SubmittedContentEditorSuggestion:
                                                                      {
                                                                        IMERCCITLReviewed:
                                                                          {
                                                                            id: {
                                                                              equals:
                                                                                iMERCCITLReviewedId,
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
              },
            },
          },
        });

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
              message: "You are not allowed to create this plagiarism file",
            },
          });
        }
      }

      // Save file to server
      const file = data.files.file[0];
      const filename = `${file.newFilename}.pdf`;
      // const filePath = file.filepath;
      // const destination = path.join(
      //   process.cwd(),
      //   `/files/plagiarism/${filename}`
      // );
      // fs.copyFile(filePath, destination, (err) => {
      //   if (err) throw err;
      // });

      // const blob = await uploadToVercelBlob(
      //   file,
      //   `files/plagiarism/${filename}`
      // );
      // const blobFilename = blob.url.split("/").at(-1);

      // create object to server
      const plagiarismFile = await prisma.plagiarismFile.create({
        data: {
          IMERCCITLReviewed: {
            connect: {
              id: iMERCCITLReviewedId,
            },
          },
          filename: filename as string,
          mimetype: file.mimetype,
          size: file.size,
          originalFilename: file.originalFilename,
        },
      });
      res.status(200).json(plagiarismFile);
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
      });
      await validator.validate(req.query);
      const { skip, take } = validator.cast(req.query);

      const plagiarismFiles = await prisma.plagiarismFile.findMany({
        skip,
        take,
        where: {},
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.plagiarismFile.count({
        where: {},
      });

      return res.json({ plagiarismFiles, count });
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
