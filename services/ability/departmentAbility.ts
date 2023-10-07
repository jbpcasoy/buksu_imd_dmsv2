import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function departmentAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "Department");
    if (user.isAdmin) {
      can("create", "Department");
      can("update", "Department");
      can("delete", "Department");
    }
  });

  return ability;
}
