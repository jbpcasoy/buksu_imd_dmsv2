import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });
      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const peerSuggestion = await prisma.peerSuggestion.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(peerSuggestion);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);
      const { id } = validator.cast(req.query);

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
        if(!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active faculty is allowed to perform this action"
            }
          })
        }

        const peerReview = await prisma.peerReview.findFirstOrThrow({
          where: {
            PeerSuggestion: {
              id: {
                equals: id,
              },
            },
          },
        });
        if(peerReview.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to delete this peer suggestion"
            }
          })
        }

        const submittedPeerSuggestion = await prisma.submittedPeerSuggestion.findFirst({
          where: {
            PeerSuggestion: {
              id: {
                equals: id
              }
            }
          }
        })
        if(submittedPeerSuggestion) {
          return res.status(400).json({
            error: {
              message: "You are not allowed to delete a submitted peer suggestion"
            }
          })
        }
      }

      const peerSuggestion = await prisma.peerSuggestion.delete({
        where: {
          id,
        },
      });

      return res.json(peerSuggestion);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
