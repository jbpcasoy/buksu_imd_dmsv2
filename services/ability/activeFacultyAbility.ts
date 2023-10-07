import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function activeFacultyAbility({ user }: { user: User }) {
  try {
    const ability = abilityBuilder((can, cannot) => {
      can("read", "ActiveFaculty");
      if (user.isAdmin) {
        can("create", "ActiveFaculty");
        can("delete", "ActiveFaculty");
      }
    });

    return ability;
  } catch (error) {
    console.error(error);
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
