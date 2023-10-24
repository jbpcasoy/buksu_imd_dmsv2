import { ActiveFaculty, Prisma, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function profilePictureFileAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ProfilePictureFile");
    can("delete", "ProfilePictureFile");

    if (user.isAdmin) {
      can("read", "ProfilePictureFile");
      can("delete", "ProfilePictureFile");
    }
  });

  return ability;
}
