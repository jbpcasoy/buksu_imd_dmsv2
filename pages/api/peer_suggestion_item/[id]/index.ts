import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
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

      const peerSuggestionItem =
        await prisma.peerSuggestionItem.findFirstOrThrow({
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

      return res.json(peerSuggestionItem);
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
              PeerSuggestionItem: {
                some: {
                  id: {
                    equals: id,
                  },
                },
              },
            },
          },
        });
        if (peerReview.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this peer suggestion item",
            },
          });
        }
      }

      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.findFirst({
          where: {
            PeerSuggestion: {
              PeerSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        });

      if (submittedPeerSuggestion) {
        throw new Error("Peer Suggestion is already submitted");
      }

      const peerSuggestionItem = await prisma.peerSuggestionItem.delete({
        where: {
          id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
        suggestion: Yup.string().optional(),
        pageNumber: Yup.number().min(0).optional(),
      });

      await validator.validate(req.body);

      const { id } = req.query;
      const { actionTaken, remarks, suggestion, pageNumber } = validator.cast(
        req.body
      );

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
              PeerSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        });
        if (peerReview.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to update this peer suggestion item",
            },
          });
        }
      }

      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.findFirst({
          where: {
            PeerSuggestion: {
              PeerSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        });

      if (submittedPeerSuggestion) {
        throw new Error("Peer Suggestion is already submitted");
      }

      const peerSuggestionItem = await prisma.peerSuggestionItem.update({
        where: {
          id: id as string,
        },
        data: {
          actionTaken,
          remarks,
          suggestion,
          pageNumber,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
