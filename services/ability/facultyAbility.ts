import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default async function facultyAbility(user: User) {
  try {
    const ability = await abilityBuilder((can, cannot) => {
      // FIXME ActiveFaculty will be equal to null if ActiveFaculty is not included
      can("connectToIM", "Faculty", {
        ActiveFaculty: {
          isNot: null,
        },
        userId: {
          equals: user.id,
        },
      });
    });

    return ability;
  } catch (error) {
    const ability = await abilityBuilder((can, cannot) => {});
    return ability;
  }
}