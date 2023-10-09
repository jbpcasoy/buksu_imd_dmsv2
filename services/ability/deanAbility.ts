import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function deanAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "Dean");
    can("create", "Dean");
    can("update", "Dean");
    can("delete", "Dean");
  });

  return ability;
}
