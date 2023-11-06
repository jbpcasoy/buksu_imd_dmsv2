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
  IDDCoordinator,
  ActiveIDDCoordinator,
  CITLDirector,
  ActiveCITLDirector,
  IDDCoordinatorSuggestion,
  IDDCoordinatorSuggestionItem,
  SubmittedIDDCoordinatorSuggestion,
  CITLRevision,
  IDDCoordinatorEndorsement,
  CITLDirectorEndorsement,
  QAMISSuggestion,
  QAMISSuggestionItem,
  SubmittedQAMISSuggestion,
  QAMISFile,
  QAMISRevision,
  QAMISCoordinatorEndorsement,
  QAMISChairpersonEndorsement,
  QAMISDeanEndorsement,
  QAMISDepartmentEndorsement,
  ContentSpecialistReview,
  ContentSpecialistSuggestion,
  ContentSpecialistSuggestionItem,
  SubmittedContentSpecialistSuggestion,
  ContentEditorReview,
  ContentEditorSuggestion,
  ContentEditorSuggestionItem,
  SubmittedContentEditorSuggestion,
  IDDSpecialistReview,
  IDDSpecialistSuggestion,
  SubmittedIDDSpecialistSuggestion,
  IDDSpecialistSuggestionItem,
  IMERCCITLReviewed,
  IMERCCITLRevision,
  IMERCIDDCoordinatorEndorsement,
  IMERCCITLDirectorEndorsement,
  ContentSpecialist,
  ActiveContentSpecialist,
  ProfilePictureFile,
  Event,
  NotificationRead,
  PlagiarismFile,
  Announcement,
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
      IDDCoordinator: IDDCoordinator;
      ActiveIDDCoordinator: ActiveIDDCoordinator;
      CITLDirector: CITLDirector;
      ActiveCITLDirector: ActiveCITLDirector;
      IDDCoordinatorSuggestion: IDDCoordinatorSuggestion;
      IDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
      SubmittedIDDCoordinatorSuggestion: SubmittedIDDCoordinatorSuggestion;
      CITLRevision: CITLRevision;
      IDDCoordinatorEndorsement: IDDCoordinatorEndorsement;
      CITLDirectorEndorsement: CITLDirectorEndorsement;
      QAMISSuggestion: QAMISSuggestion;
      QAMISSuggestionItem: QAMISSuggestionItem;
      SubmittedQAMISSuggestion: SubmittedQAMISSuggestion;
      QAMISFile: QAMISFile;
      QAMISRevision: QAMISRevision;
      QAMISCoordinatorEndorsement: QAMISCoordinatorEndorsement;
      QAMISChairpersonEndorsement: QAMISChairpersonEndorsement;
      QAMISDeanEndorsement: QAMISDeanEndorsement;
      QAMISDepartmentEndorsement: QAMISDepartmentEndorsement;
      ContentSpecialistReview: ContentSpecialistReview;
      ContentSpecialistSuggestion: ContentSpecialistSuggestion;
      ContentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
      SubmittedContentSpecialistSuggestion: SubmittedContentSpecialistSuggestion;
      ContentEditorReview: ContentEditorReview;
      ContentEditorSuggestion: ContentEditorSuggestion;
      ContentEditorSuggestionItem: ContentEditorSuggestionItem;
      SubmittedContentEditorSuggestion: SubmittedContentEditorSuggestion;
      IDDSpecialistReview: IDDSpecialistReview;
      IDDSpecialistSuggestion: IDDSpecialistSuggestion;
      IDDSpecialistSuggestionItem: IDDSpecialistSuggestionItem;
      SubmittedIDDSpecialistSuggestion: SubmittedIDDSpecialistSuggestion;
      IMERCCITLReviewed: IMERCCITLReviewed;
      IMERCCITLRevision: IMERCCITLRevision;
      IMERCIDDCoordinatorEndorsement: IMERCIDDCoordinatorEndorsement;
      IMERCCITLDirectorEndorsement: IMERCCITLDirectorEndorsement;
      ContentSpecialist: ContentSpecialist;
      ActiveContentSpecialist: ActiveContentSpecialist;
      ProfilePictureFile: ProfilePictureFile;
      Event: Event;
      NotificationRead: NotificationRead;
      PlagiarismFile: PlagiarismFile;
      Announcement: Announcement;
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
