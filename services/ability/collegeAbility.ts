import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function collegeAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
  });

  return ability;
}
