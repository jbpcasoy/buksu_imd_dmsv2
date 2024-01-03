import { ActiveFaculty, Prisma, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    const iMOwnerWhere: Prisma.IMWhereInput = {
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
    can("read", "IM");
    // TODO remove these
    can("connectToIMFile", "IM", iMOwnerWhere);
    can("connectToPlagiarismFile", "IM", iMOwnerWhere);
    can("connectToDepartmentReview", "IM", iMOwnerWhere);
    can("update", "IM", iMOwnerWhere);
    can("delete", "IM", iMOwnerWhere);

    if (user.isAdmin) {
      // TODO remove these
      can("connectToIMFile", "IM");
      can("connectToPlagiarismFile", "IM");
      can("update", "IM");
      can("delete", "IM");
    }
  });

  return ability;
}
