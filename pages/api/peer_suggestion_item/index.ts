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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        peerSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const { actionTaken, peerSuggestionId, remarks, suggestion, pageNumber } =
        validator.cast(req.body);

      if (!user.isAdmin) {
        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: user.id,
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

        const peerReview = await prisma.peerReview.findFirstOrThrow({
          where: {
            PeerSuggestion: {
              id: {
                equals: peerSuggestionId,
              },
            },
          },
        });
        if (peerReview.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this peer suggestion item",
            },
          });
        }
      }

      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.findFirst({
          where: {
            PeerSuggestion: {
              id: {
                equals: peerSuggestionId,
              },
            },
          },
        });

      if (submittedPeerSuggestion) {
        throw new Error("Peer Suggestion is already submitted");
      }

      const peerSuggestionItem = await prisma.peerSuggestionItem.create({
        data: {
          actionTaken,
          remarks,
          suggestion,
          pageNumber,
          PeerSuggestion: {
            connect: {
              id: peerSuggestionId,
            },
          },
        },
      });

      return res.json(peerSuggestionItem);
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
        "filter[peerSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[peerSuggestionId]": filterPeerSuggestionId,
      } = validator.cast(req.query);
      const peerSuggestionItems = await prisma.peerSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              PeerSuggestion: {
                id: {
                  equals: filterPeerSuggestionId,
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.peerSuggestionItem.count({
        where: {
          AND: [
            {
              PeerSuggestion: {
                id: {
                  equals: filterPeerSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ peerSuggestionItems, count });
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
