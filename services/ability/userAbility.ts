import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function userAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // TODO remove this
    can("connectToProfilePictureFile", "User", {
      id: {
        equals: user.id,
      },
    });
  });

  return ability;
}
