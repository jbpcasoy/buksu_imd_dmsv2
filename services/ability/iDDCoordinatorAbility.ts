import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default function iDDCoordinatorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "IDDCoordinator");
  });

  return ability;
}
