import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function userAbility(user: User) {
  try {
    const ability = abilityBuilder((can, cannot) => {
      can("read", "User")
    });

    return ability;
  } catch (error) {
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
