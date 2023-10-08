import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMFileAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "IMFile", {
      IM: {
        is: {
          Faculty: {
            is: {
              userId: user.id,
            },
          },
        },
      },
    });
    can("delete", "IMFile", {
      IM: {
        is: {
          Faculty: {
            is: {
              userId: {
                equals: user.id,
              },
            },
          },
        },
      },
    });

    if (user.isAdmin) {
      can("read", "IMFile");
      can("delete", "IMFile");
    }
  });

  return ability;
}
