import { Rating } from "@prisma/client";

export interface F001Props {
  iMTitle: string;
  authorNames: string;
  iMType: "Module" | "Course File" | "Worktext" | "Textbook";
  departmentName: string;
  collegeName: string;
  coordinatorName: string;
  iDDCoordinatorName: string;
}

export interface F003Suggestion {
  suggestion: string;
  actionTaken: string;
  pageNumber: number;
  remarks: string;
}

export interface F003Props {
  iMTitle: string;
  programReview: F003Suggestion[];
  coordinatorName: string;
  cITLReview: F003Suggestion[];
  iDDCoordinatorName: string;
  cITLDirectorName: string;
  vPAAName: string;
}

export interface F004Props {
  iMTitle: string;
}

export interface F005Props {
  iMTitle: string;
}

export interface F011Props {
  authorName: string;
  iMTitle: string;
  iMType: "Module" | "Course File" | "Worktext" | "Textbook";
  coordinatorName: string;
  chairpersonName: string;
  deanName: string;
  iDDCoordinatorName: string;
}

export interface F012Props {
  iMTitle: string;
  authorNames: string;
  iMType: "Module" | "Course File" | "Worktext" | "Textbook";
  departmentName: string;
  collegeName: string;
  applicantName: string;
  coordinatorName: string;
  chairpersonName: string;
  deanName: string;
}

export interface F013Props {
  iMTitle: string;
  authorNames: string;
  iMType: "Module" | "Course File" | "Worktext" | "Textbook";
  coordinatorName: string;
  chairpersonName: string;
  ratings: (Rating | null)[][];
  seniorFacultyName: string;
}

export interface F014Props {
  iMTitle: string;
  authorNames: string;
  iMType: "Module" | "Course File" | "Worktext" | "Textbook";
  contentSpecialistRatings: (Rating | null)[][];
  contentEditorRatings: (Rating | null)[][];
  iDDSpecialistRatings: (Rating | null)[][];
  contentSpecialistName: string;
  iDDCoordinatorName: string;
  cITLDirectorName: string;
}

export interface F015Suggestion {
  suggestion: string;
  actionTaken: string;
  pageNumber: number;
  remarks: string;
}

export interface F015Props {
  iMTitle: string;
  qAMISReview: F015Suggestion[];
  coordinatorName: string;
  iMERCReview: F015Suggestion[];
  iDDCoordinatorName: string;
  authorName: string;
  programName: string;
}
