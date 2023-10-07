import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function userAbility({user}: {user: User}) {
  try {
    const ability = abilityBuilder((can, cannot) => {
      can("read", "User");
    });

    return ability;
  } catch (error) {
    console.error(error);
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
