import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import {
  ActiveFaculty,
  ActiveIMFile,
  College,
  Department,
  Faculty,
  IM,
  IMFile,
  User,
} from "@prisma/client";

export type AppSubjects =
  | "all"
  | Subjects<{
      User: User;
      IM: IM;
      Faculty: Faculty;
      College: College;
      ActiveFaculty: ActiveFaculty;
      Department: Department;
      IMFile: IMFile;
      ActiveIMFile: ActiveIMFile;
    }>;
export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

export default function abilityBuilder(
  checker: (
    can: AbilityBuilder<AppAbility>["can"],
    cannot: AbilityBuilder<AppAbility>["cannot"]
  ) => any
) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  checker(can, cannot);

  const ability = build();
  return ability;
}

// TODO implement testing