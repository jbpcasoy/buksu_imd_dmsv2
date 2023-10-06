import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default function facultyAbility(user: User) {
  try {
    const ability = abilityBuilder((can, cannot) => {
      can("read", "Faculty");

      if (user.isAdmin) {
        can("create", "Faculty");
        can("delete", "Faculty");
        can("connectToIM", "Faculty");
      }
    });

    return ability;
  } catch (error) {
    console.error(error);
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
