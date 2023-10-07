import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function collegeAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "College");
    if (user.isAdmin) {
      can("create", "College");
      can("update", "College");
      can("delete", "College");
    }
  });

  return ability;
}
