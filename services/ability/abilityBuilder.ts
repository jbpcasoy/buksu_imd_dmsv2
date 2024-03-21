import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import {
  ActiveCITLDirector,
  ActiveChairperson,
  ActiveContentSpecialist,
  ActiveCoordinator,
  ActiveDean,
  ActiveFaculty,
  ActiveIDDCoordinator,
  Announcement,
  CITLDirector,
  CITLDirectorEndorsement,
  CITLRevision,
  Chairperson,
  ChairpersonReview,
  ChairpersonSuggestion,
  ChairpersonSuggestionItem,
  ChairpersonSuggestionItemActionTaken,
  College,
  ContentEditorReview,
  ContentEditorSuggestion,
  ContentEditorSuggestionItem,
  ContentEditorSuggestionItemActionTaken,
  ContentSpecialist,
  ContentSpecialistReview,
  ContentSpecialistSuggestion,
  ContentSpecialistSuggestionItem,
  ContentSpecialistSuggestionItemActionTaken,
  Coordinator,
  CoordinatorEndorsement,
  CoordinatorReview,
  CoordinatorSuggestion,
  CoordinatorSuggestionItem,
  CoordinatorSuggestionItemActionTaken,
  Dean,
  DeanEndorsement,
  Department,
  DepartmentReview,
  DepartmentReviewed,
  DepartmentRevision,
  Event,
  Faculty,
  IDDCoordinator,
  IDDCoordinatorEndorsement,
  IDDCoordinatorSuggestion,
  IDDCoordinatorSuggestionItem,
  IDDCoordinatorSuggestionItemActionTaken,
  IDDSpecialistReview,
  IDDSpecialistSuggestion,
  IDDSpecialistSuggestionItem,
  IDDSpecialistSuggestionItemActionTaken,
  IM,
  IMERCCITLDirectorEndorsement,
  IMERCCITLReviewed,
  IMERCCITLRevision,
  IMERCIDDCoordinatorEndorsement,
  IMFile,
  NotificationRead,
  PeerReview,
  PeerSuggestion,
  PeerSuggestionItem,
  PeerSuggestionItemActionTaken,
  PlagiarismFile,
  ProfilePictureFile,
  QAMISChairpersonEndorsement,
  QAMISCoordinatorEndorsement,
  QAMISDeanEndorsement,
  QAMISDepartmentEndorsement,
  QAMISFile,
  QAMISRevision,
  QAMISSuggestion,
  QAMISSuggestionItem,
  ReturnedCITLRevision,
  ReturnedCITLRevisionSuggestionItem,
  ReturnedCITLRevisionSuggestionItemActionTaken,
  ReturnedDepartmentRevision,
  ReturnedDepartmentRevisionSuggestionItem,
  ReturnedDepartmentRevisionSuggestionItemActionTaken,
  ReturnedIMERCCITLRevision,
  ReturnedIMERCCITLRevisionSuggestionItem,
  ReturnedIMERCCITLRevisionSuggestionItemActionTaken,
  SubmittedChairpersonSuggestion,
  SubmittedContentEditorSuggestion,
  SubmittedContentSpecialistSuggestion,
  SubmittedCoordinatorSuggestion,
  SubmittedIDDCoordinatorSuggestion,
  SubmittedIDDSpecialistSuggestion,
  SubmittedPeerSuggestion,
  SubmittedQAMISSuggestion,
  SubmittedReturnedCITLRevision,
  SubmittedReturnedDepartmentRevision,
  SubmittedReturnedIMERCCITLRevision,
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
      ReturnedDepartmentRevision: ReturnedDepartmentRevision;
      ReturnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
      SubmittedReturnedDepartmentRevision: SubmittedReturnedDepartmentRevision;
      ReturnedCITLRevision: ReturnedCITLRevision;
      ReturnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
      SubmittedReturnedCITLRevision: SubmittedReturnedCITLRevision;
      ReturnedIMERCCITLRevision: ReturnedIMERCCITLRevision;
      ReturnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
      SubmittedReturnedIMERCCITLRevision: SubmittedReturnedIMERCCITLRevision;
      PeerSuggestionItemActionTaken: PeerSuggestionItemActionTaken;
      ChairpersonSuggestionItemActionTaken: ChairpersonSuggestionItemActionTaken;
      CoordinatorSuggestionItemActionTaken: CoordinatorSuggestionItemActionTaken;
      ReturnedDepartmentRevisionSuggestionItemActionTaken: ReturnedDepartmentRevisionSuggestionItemActionTaken;
      IDDCoordinatorSuggestionItemActionTaken: IDDCoordinatorSuggestionItemActionTaken;
      ReturnedCITLRevisionSuggestionItemActionTaken: ReturnedCITLRevisionSuggestionItemActionTaken;
      ContentEditorSuggestionItemActionTaken: ContentEditorSuggestionItemActionTaken;
      ContentSpecialistSuggestionItemActionTaken: ContentSpecialistSuggestionItemActionTaken;
      IDDSpecialistSuggestionItemActionTaken: IDDSpecialistSuggestionItemActionTaken;
      ReturnedIMERCCITLRevisionSuggestionItemActionTaken: ReturnedIMERCCITLRevisionSuggestionItemActionTaken;
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
