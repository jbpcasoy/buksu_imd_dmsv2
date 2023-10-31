import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function notificationReadAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "NotificationRead");
    can("create", "NotificationRead");
    can("update", "NotificationRead");
    can("delete", "NotificationRead");
  });

  return ability;
}
