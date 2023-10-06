import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default async function departmentAbility(user: User) {
  try {
    const ability = await abilityBuilder((can, cannot) => {
      can("read", "Department");
      if (user.isAdmin) {
        can("create", "Department");
        can("update", "Department");
        can("delete", "Department")
      }
    });

    return ability;
  } catch (error) {
    const ability = await abilityBuilder((can, cannot) => {});
    return ability;
  }
}
