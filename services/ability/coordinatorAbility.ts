import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function coordinatorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "Coordinator");
  });

  return ability;
}
