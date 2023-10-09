import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function activeChairpersonAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ActiveChairperson");
    can("create", "ActiveChairperson");
    can("update", "ActiveChairperson");
    can("delete", "ActiveChairperson");
  });

  return ability;
}
