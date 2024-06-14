import {
  ActiveCITLDirector,
  ActiveChairperson,
  ActiveContentSpecialist,
  ActiveCoordinator,
  ActiveDean,
  ActiveFaculty,
  ActiveIDDCoordinator,
  CITLDirector,
  Chairperson,
  College,
  ContentSpecialist,
  Coordinator,
  Dean,
  Department,
  Faculty,
  IDDCoordinator,
  User,
} from "@prisma/client";

export const MockAdminUser: User = {
  id: "clventgry000020jex6bravtc",
  name: "Harriett Gregory",
  email: "mur@zipo.cz",
  emailVerified: null,
  image: "http://de.gl/ropus",
  isAdmin: true,
};
export const MockNonAdminUser: User = {
  id: "clventgry000020jex6bravtd",
  name: "Ina Weaver",
  email: "sarvakjaz@gupul.tp",
  emailVerified: null,
  image: "http://joknum.nz/filuv",
  isAdmin: false,
};
export const MockFacultyUser: User = {
  id: "clventgry000020jex6bravte",
  name: "Isabel Benson",
  email: "foddoaz@micag.be",
  emailVerified: null,
  image: "http://upi.az/lehvuc",
  isAdmin: false,
};

export const MockCollege: College = {
  id: "clveswte60002p8yaq1khl7ub",
  createdAt: new Date("2024-04-25T05:26:25.230Z"),
  updatedAt: new Date("2024-04-25T05:26:25.230Z"),
  name: "College of Technology",
};

export const MockDepartment: Department = {
  id: "clveyh1m500004vkgv2k0hi4u",
  createdAt: new Date("2024-04-25T08:02:07.085Z"),
  updatedAt: new Date("2024-04-25T08:02:07.085Z"),
  name: "Information Technology",
  collegeId: "clveswte60002p8yaq1khl7ub",
};

export const MockFaculty: Faculty = {
  id: "clvfxbg4n0002zt1ijhzxgk8j",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  userId: "clveo592i000720je9uvjy8pg",
  departmentId: "clveyh1m500004vkgv2k0hi4u",
};

export const MockActiveFaculty: ActiveFaculty = {
  id: "clvg4cg580002cby9ea8lmbal",
  createdAt: new Date("2024-04-26T03:34:16.509Z"),
  updatedAt: new Date("2024-04-26T03:34:16.509Z"),
  facultyId: "clvg36ufe0000cby9sk7hsvt1",
};

export const MockChairperson: Chairperson = {
  id: "clvfxbg4n0002zt1ijhzxgk8k",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  facultyId: "clvfxbg4n0002zt1ijhzxgk8j",
};

export const MockActiveChairperson: ActiveChairperson = {
  id: "clvfxbg4n0002zt1ijhzxgk8l",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  chairpersonId: "clvfxbg4n0002zt1ijhzxgk8k",
};

export const MockCoordinator: Coordinator = {
  id: "clvfxbg4n0002zt1ijhzxgk8m",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  facultyId: "clvfxbg4n0002zt1ijhzxgk8j",
};

export const MockActiveCoordinator: ActiveCoordinator = {
  id: "clvfxbg4n0002zt1ijhzxgk8n",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  coordinatorId: "clvfxbg4n0002zt1ijhzxgk8m",
};

export const MockDean: Dean = {
  id: "clvfxbg4n0002zt1ijhzxgk8o",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  facultyId: "clvfxbg4n0002zt1ijhzxgk8j",
};

export const MockActiveDean: ActiveDean = {
  id: "clvfxbg4n0002zt1ijhzxgk8p",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  deanId: "clvfxbg4n0002zt1ijhzxgk8o",
};

export const MockContentSpecialist: ContentSpecialist = {
  id: "clvfxbg4n0002zt1ijhzxgk8q",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  facultyId: "clvfxbg4n0002zt1ijhzxgk8p",
};

export const MockActiveContentSpecialist: ActiveContentSpecialist = {
  id: "clvfxbg4n0002zt1ijhzxgk8r",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  contentSpecialistId: "clvfxbg4n0002zt1ijhzxgk8q",
};

export const MockIDDCoordinator: IDDCoordinator = {
  id: "clvfxbg4n0002zt1ijhzxgk8s",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  userId: "clvfxbg4n0002zt1ijhzxgk8t",
};

export const MockActiveIDDCoordinator: ActiveIDDCoordinator = {
  id: "clvfxbg4n0002zt1ijhzxgk8u",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  iDDCoordinatorId: "clvfxbg4n0002zt1ijhzxgk8s",
};

export const MockCITLDirector: CITLDirector = {
  id: "clvfxbg4n0002zt1ijhzxgk8v",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  userId: "clvfxbg4n0002zt1ijhzxgk8x",
};

export const MockActiveCITLDirector: ActiveCITLDirector = {
  id: "clvfxbg4n0002zt1ijhzxgk8w",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  cITLDirectorId: "clvfxbg4n0002zt1ijhzxgk8v",
};
