import { ActiveFaculty, Prisma, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function plagiarismFileAbility({ user }: { user: User }) {
  const where: Prisma.PlagiarismFileWhereInput = {
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
    can("read", "PlagiarismFile");
    can("delete", "PlagiarismFile", where);

    if (user.isAdmin) {
      can("read", "PlagiarismFile");
      can("delete", "PlagiarismFile");
    }
  });

  return ability;
}