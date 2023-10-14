import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import {
  ActiveChairperson,
  ActiveCoordinator,
  ActiveDean,
  ActiveFaculty,
  Chairperson,
  ChairpersonReview,
  ChairpersonSuggestion,
  ChairpersonSuggestionItem,
  College,
  Coordinator,
  Dean,
  Department,
  DepartmentReview,
  Faculty,
  IM,
  IMFile,
  PeerReview,
  PeerSuggestion,
  PeerSuggestionItem,
  SubmittedChairpersonSuggestion,
  SubmittedPeerSuggestion,
  User,
  CoordinatorReview,
  CoordinatorSuggestion,
  CoordinatorSuggestionItem,
  SubmittedCoordinatorSuggestion,
  DepartmentRevision,
  CoordinatorEndorsement,
  DeanEndorsement,
  DepartmentReviewed,
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
      Chairperson: Chairperson;
      Coordinator: Coordinator;
      Dean: Dean;
      ActiveCoordinator: ActiveCoordinator;
      ActiveChairperson: ActiveChairperson;
      ActiveDean: ActiveDean;
      DepartmentReview: DepartmentReview;
      PeerReview: PeerReview;
      PeerSuggestion: PeerSuggestion;
      PeerSuggestionItem: PeerSuggestionItem;
      SubmittedPeerSuggestion: SubmittedPeerSuggestion;
      ChairpersonReview: ChairpersonReview;
      ChairpersonSuggestion: ChairpersonSuggestion;
      ChairpersonSuggestionItem: ChairpersonSuggestionItem;
      SubmittedChairpersonSuggestion: SubmittedChairpersonSuggestion;
      CoordinatorReview: CoordinatorReview;
      CoordinatorSuggestion: CoordinatorSuggestion;
      CoordinatorSuggestionItem: CoordinatorSuggestionItem;
      SubmittedCoordinatorSuggestion: SubmittedCoordinatorSuggestion;
      DepartmentRevision: DepartmentRevision;
      CoordinatorEndorsement: CoordinatorEndorsement;
      DeanEndorsement: DeanEndorsement;
      DepartmentReviewed: DepartmentReviewed;
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
