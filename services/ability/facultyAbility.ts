import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default function facultyAbility(user: User) {
  try {
    const ability = abilityBuilder((can, cannot) => {
      // FIXME ActiveFaculty will be equal to null if ActiveFaculty is not included
      can("connectToIM", "Faculty", {
        ActiveFaculty: {
          isNot: null,
        },
        userId: {
          equals: user.id,
        },
      });

      can("read", "Faculty");

      if (user.isAdmin) {
        can("create", "Faculty");
        can("delete", "Faculty");
      }
    });

    return ability;
  } catch (error) {
    console.error(error);
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
