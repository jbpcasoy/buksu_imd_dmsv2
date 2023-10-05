import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default async function userAbility(user: User) {
  try {
    const ability = await abilityBuilder((can, cannot) => {
      can("read", "User")
    });

    return ability;
  } catch (error) {
    const ability = await abilityBuilder((can, cannot) => {});
    return ability;
  }
}
