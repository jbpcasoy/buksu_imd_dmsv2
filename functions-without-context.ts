import prisma from "@/prisma/client";

interface CreateUser {
  name: string;
  email: string;
  acceptTermsAndConditions: boolean;
}

export async function createUser(user: CreateUser) {
  if (user.acceptTermsAndConditions) {
    return await prisma.userTest.create({
      data: user,
    });
  } else {
    return new Error("User must accept terms!");
  }
}

interface UpdateUser {
  id: number;
  name: string;
  email: string;
}

export async function updateUsername(user: UpdateUser) {
  return await prisma.userTest.update({
    where: { id: user.id },
    data: user,
  });
}
