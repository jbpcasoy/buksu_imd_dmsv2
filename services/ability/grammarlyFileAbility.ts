import { ActiveFaculty, Prisma, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function grammarlyFileAbility({ user }: { user: User }) {
  const where: Prisma.GrammarlyFileWhereInput = {
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
    can("read", "GrammarlyFile");
    can("delete", "GrammarlyFile", where);

    if (user.isAdmin) {
      can("read", "GrammarlyFile");
      can("delete", "GrammarlyFile");
    }
  });

  return ability;
}
