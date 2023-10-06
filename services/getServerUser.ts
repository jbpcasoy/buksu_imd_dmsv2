import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function getServerUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User> {
  const session = await getServerSession(req, res, authOptions);
  console.log({ session });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
