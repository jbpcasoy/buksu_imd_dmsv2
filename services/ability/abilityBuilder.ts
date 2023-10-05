import { User, Prisma, IM, Faculty } from "@prisma/client";
import { PureAbility, AbilityBuilder, subject } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";

type AppSubjects = "all" | Subjects<{ User: User, IM: IM, Faculty: Faculty }>;
type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

export default async function abilityBuilder(
  checker: (
    can: AbilityBuilder<AppAbility>["can"],
    cannot: AbilityBuilder<AppAbility>["cannot"]
  ) => any
) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  await checker(can, cannot);

  const ability = build();
  return ability;
}
