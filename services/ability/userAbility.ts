import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function userAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "User");
    can("connectToProfilePictureFile", "User", {
      id: {
        equals: user.id,
      },
    });
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
