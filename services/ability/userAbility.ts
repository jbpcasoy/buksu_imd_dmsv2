import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

// In this context user is the current users information while userData is the user that is to be modified
export default function userAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "User");
    can("update", "User", {
      id: {
        equals: user.id,
      },
    });

    if (user?.isAdmin) {
      can("update", "User");
    }
  });

  return ability;
}
