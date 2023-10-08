import { ActiveFaculty, Prisma, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    const where: Prisma.IMWhereInput = {
      Faculty: {
        is: {
          ActiveFaculty: {
            is: {
              Faculty: {
                is: {
                  User: {
                    is: {
                      id: {
                        equals: user.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    can("connectToIMFile", "IM", where);
    can("read", "IM", where);
    can("update", "IM", where);
    can("delete", "IM", where);

    if (user.isAdmin) {
      can("connectToIMFile", "IM");
      can("read", "IM");
      can("update", "IM");
      can("delete", "IM");
    }
  });

  return ability;
}
