import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default function facultyAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "Faculty");
    // TODO remove this
    can("connectToIM", "Faculty", {
      userId: {
        equals: user.id,
      },
    });

    if (user.isAdmin) {
      // TODO remove this
      can("connectToIM", "Faculty");
    }
  });

  return ability;
}
