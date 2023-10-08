import { ActiveFaculty, Prisma, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMFileAbility({ user }: { user: User }) {
  const where: Prisma.IMFileWhereInput = {
    IM: {
      is: {
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
      },
    },
  };
  
  const ability = abilityBuilder((can, cannot) => {
    can("read", "IMFile", where);
    can("delete", "IMFile", where);

    if (user.isAdmin) {
      can("read", "IMFile");
      can("delete", "IMFile");
    }
  });

  return ability;
}
