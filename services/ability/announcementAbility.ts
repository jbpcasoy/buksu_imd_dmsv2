import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function announcementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "Announcement");
    if (user.isAdmin) {
      can("create", "Announcement");
      can("update", "Announcement");
      can("delete", "Announcement");
    }
  });

  return ability;
}
