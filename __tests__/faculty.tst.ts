import { prismaMock } from "@/prisma/singleton";
import {
  createFaculty,
  deleteFaculty,
  readFaculties,
  readFaculty,
} from "@/services/facultyService";
import { College, Department, Faculty, User } from "@prisma/client";

const adminUser: User = {
  id: "clventgry000020jex6bravtc",
  name: "Harriett Gregory",
  email: "mur@zipo.cz",
  emailVerified: null,
  image: "http://de.gl/ropus",
  isAdmin: true,
};
const nonAdminUser: User = {
  id: "clventgry000020jex6bravtd",
  name: "Ina Weaver",
  email: "sarvakjaz@gupul.tp",
  emailVerified: null,
  image: "http://joknum.nz/filuv",
  isAdmin: false,
};
const facultyUser: User = {
  id: "clventgry000020jex6bravte",
  name: "Isabel Benson",
  email: "foddoaz@micag.be",
  emailVerified: null,
  image: "http://upi.az/lehvuc",
  isAdmin: false,
};

const college: College = {
  id: "clveswte60002p8yaq1khl7ub",
  createdAt: new Date("2024-04-25T05:26:25.230Z"),
  updatedAt: new Date("2024-04-25T05:26:25.230Z"),
  name: "College of Technology",
};

const department: Department = {
  id: "clveyh1m500004vkgv2k0hi4u",
  createdAt: new Date("2024-04-25T08:02:07.085Z"),
  updatedAt: new Date("2024-04-25T08:02:07.085Z"),
  name: "Information Technology",
  collegeId: "clveswte60002p8yaq1khl7ub",
};

const faculty: Faculty = {
  id: "clvfxbg4n0002zt1ijhzxgk8j",
  createdAt: new Date("2024-04-26T00:17:32.519Z"),
  updatedAt: new Date("2024-04-26T00:17:32.519Z"),
  userId: "clveo592i000720je9uvjy8pg",
  departmentId: "clveyh1m500004vkgv2k0hi4u",
};

describe("Action: CREATE Faculty", () => {
  describe("Role: Admin", () => {
    test("Scenario: Unique Faculty", async () => {
      prismaMock.faculty.create.mockResolvedValueOnce(faculty);

      expect(
        createFaculty({
          departmentId: department.id,
          user: adminUser,
          userId: facultyUser.id,
        })
      ).resolves.toEqual(faculty);
    });
    test("Scenario: Duplicate Faculty", async () => {
      prismaMock.faculty.findFirst.mockResolvedValueOnce(faculty);
      prismaMock.faculty.create.mockResolvedValueOnce(faculty);

      expect(
        createFaculty({
          departmentId: department.id,
          user: adminUser,
          userId: facultyUser.id,
        })
      ).rejects.toThrow("Faculty already exists");
    });
  });

  test("Role: User", async () => {
    prismaMock.faculty.create.mockResolvedValueOnce(faculty);

    expect(
      createFaculty({
        departmentId: department.id,
        user: nonAdminUser,
        userId: facultyUser.id,
      })
    ).rejects.toThrow("You are not allowed to create a faculty");
  });
});

describe("Action: READ Faculties", () => {
  test("Role: User", async () => {
    prismaMock.faculty.findMany.mockResolvedValueOnce([faculty]);
    prismaMock.faculty.count.mockResolvedValueOnce(1);

    expect(readFaculties({ skip: 0, take: 10 })).resolves.toEqual({
      count: 1,
      faculties: [faculty],
    });
  });
});

describe("Action: READ Faculty", () => {
  test("Role: User", async () => {
    prismaMock.faculty.findUnique.mockResolvedValueOnce(faculty);

    expect(readFaculty({ id: faculty.id })).resolves.toEqual(faculty);
  });
});

describe("Action: DELETE Faculty", () => {
  test("Role: Admin", async () => {
    prismaMock.faculty.delete.mockResolvedValueOnce(faculty);

    expect(deleteFaculty({ user: adminUser, id: faculty.id })).resolves.toEqual(
      faculty
    );
  });
  test("Role: User", async () => {
    prismaMock.faculty.delete.mockResolvedValueOnce(faculty);

    expect(
      deleteFaculty({ id: faculty.id, user: nonAdminUser })
    ).rejects.toThrow("You are not allowed to delete this faculty");
  });
});
