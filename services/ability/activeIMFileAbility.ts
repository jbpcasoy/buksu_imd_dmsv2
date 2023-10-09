import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function aciveIMFileAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ActiveIMFile");
    can("create", "ActiveIMFile");
    can("update", "ActiveIMFile");
    can("delete", "ActiveIMFile");
  });

  return ability;
}
