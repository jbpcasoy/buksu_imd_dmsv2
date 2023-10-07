import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function userAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "User");
  });

  return ability;
}
