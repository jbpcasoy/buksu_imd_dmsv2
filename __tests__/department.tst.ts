import { prismaMock } from "@/prisma/singleton";
import {
  createDepartment,
  deleteDepartment,
  readDepartment,
  readDepartments,
  updateDepartment,
} from "@/services/departmentService";
import { College, Department, User } from "@prisma/client";

const adminUser: User = {
  id: "clventgry000020jex6bravtc",
  name: "Harriett Gregory",
  email: "mur@zipo.cz",
  emailVerified: null,
  image: "http://de.gl/ropus",
  isAdmin: true,
};
const nonAdminUser: User = {
  id: "clventgry000020jex6bravtc",
  name: "Ina Weaver",
  email: "sarvakjaz@gupul.tp",
  emailVerified: null,
  image: "http://joknum.nz/filuv",
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

describe("Action: CREATE Department", () => {
  describe("Role: Admin", () => {
    test("Scenario: Unique Name", async () => {
      prismaMock.college.findFirstOrThrow.mockResolvedValueOnce(college);
      prismaMock.department.create.mockResolvedValueOnce(department);

      await expect(
        createDepartment({
          user: adminUser,
          name: "Information Technology",
          collegeId: college.id,
        })
      ).resolves.toEqual(department);
    });

    test("Scenario: Duplicate Name", async () => {
      prismaMock.college.findFirstOrThrow.mockResolvedValueOnce(college);
      prismaMock.department.findFirst.mockResolvedValueOnce(department);
      prismaMock.department.create.mockResolvedValueOnce(department);

      await expect(
        createDepartment({
          user: adminUser,
          name: "Information Technology",
          collegeId: college.id,
        })
      ).rejects.toThrow("Department name is already used");
    });
  });

  test("Role: User", async () => {
    prismaMock.department.create.mockResolvedValueOnce(department);

    await expect(
      createDepartment({
        user: nonAdminUser,
        name: "Information Technology",
        collegeId: college.id,
      })
    ).rejects.toThrow("You are not allowed to create a department");
  });
});

describe("Action: READ Departments", () => {
  test("Role: User", async () => {
    prismaMock.department.findMany.mockResolvedValueOnce([department]);
    prismaMock.department.count.mockResolvedValueOnce(1);

    await expect(
      readDepartments({
        skip: 0,
        take: 10,
      })
    ).resolves.toEqual({
      count: 1,
      departments: [department],
    });
  });
});

describe("Action: READ Department", () => {
  test("Role: User", async () => {
    prismaMock.department.findUnique.mockResolvedValueOnce(department);

    expect(readDepartment({ id: department.id })).resolves.toEqual(department);
  });
});

describe("Action: UPDATE Department", () => {
  describe("Role: Admin", () => {
    test("Scenario: Unique Name", async () => {
      prismaMock.department.update.mockResolvedValueOnce(department);

      expect(
        updateDepartment({
          id: department.id,
          name: "Information Technology",
          user: adminUser,
        })
      ).resolves.toEqual(department);
    });

    test("Scenario: Duplicate Name", async () => {
      prismaMock.department.findFirst.mockResolvedValueOnce(department);
      prismaMock.department.update.mockResolvedValueOnce(department);

      expect(
        updateDepartment({
          id: department.id,
          name: "Information Technology",
          user: adminUser,
        })
      ).rejects.toThrow("Department name is already used");
    });
  });

  test("Role: User", async () => {
    prismaMock.department.update.mockResolvedValueOnce(department);

    expect(
      updateDepartment({
        id: department.id,
        name: "Information technology",
        user: nonAdminUser,
      })
    ).rejects.toThrow("You are not allowed to update this department");
  });
});

describe("Action: DELETE Department", () => {
  test("Role: Admin", async () => {
    prismaMock.department.delete.mockResolvedValueOnce(department);

    expect(
      deleteDepartment({ id: department.id, user: adminUser })
    ).resolves.toEqual(department);
  });

  test("Role: User", async () => {
    prismaMock.department.delete.mockResolvedValueOnce(department);

    expect(
      deleteDepartment({ id: department.id, user: nonAdminUser })
    ).rejects.toThrow("You are not allowed to delete this department");
  });
});
