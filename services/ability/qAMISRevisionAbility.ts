import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "QAMISRevision");
    can("create", "QAMISRevision");
    can("update", "QAMISRevision");
    can("delete", "QAMISRevision");
  });

  return ability;
}
