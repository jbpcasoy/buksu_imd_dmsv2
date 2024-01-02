import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function departmentAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "Department");
  });

  return ability;
}
