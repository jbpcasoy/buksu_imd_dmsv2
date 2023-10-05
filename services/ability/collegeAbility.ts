import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default async function collegeAbility(user: User) {
  try {
    const ability = await abilityBuilder((can, cannot) => {
      can("read", "College");
      if (user.isAdmin) {
        can("create", "College");
        can("update", "College");
        can("delete", "College")
      }
    });

    return ability;
  } catch (error) {
    const ability = await abilityBuilder((can, cannot) => {});
    return ability;
  }
}
