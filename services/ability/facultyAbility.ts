import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default function facultyAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "Faculty");
    can("connectToIM", "Faculty", {
      userId: {
        equals: user.id,
      },
    });

    if (user.isAdmin) {
      can("connectToIM", "Faculty");
      can("create", "Faculty");
      can("delete", "Faculty");
    }
  });

  return ability;
}
