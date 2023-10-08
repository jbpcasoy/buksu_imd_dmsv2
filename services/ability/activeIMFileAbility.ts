import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function collegeAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "College");
    can("create", "College");
    can("update", "College");
    can("delete", "College");
  });

  return ability;
}
