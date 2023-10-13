import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function deanEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "DeanEndorsement");
    can("create", "DeanEndorsement");
    can("update", "DeanEndorsement");
    can("delete", "DeanEndorsement");
  });

  return ability;
}
