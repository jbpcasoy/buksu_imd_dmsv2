import { prismaMock } from "@/prisma/singleton";
import {
  createDepartment,
  deleteDepartment,
  readDepartment,
  readDepartments,
  updateDepartment,
} from "@/services/departmentService";
import {
  MockAdminUser,
  MockCollege,
  MockDepartment,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: Department", () => {
  describe("Action: CREATE Department", () => {
    describe("Role: Admin", () => {
      test("Scenario: Unique Name", async () => {
        prismaMock.college.findFirstOrThrow.mockResolvedValueOnce(MockCollege);
        prismaMock.department.create.mockResolvedValueOnce(MockDepartment);

        await expect(
          createDepartment({
            user: MockAdminUser,
            name: "Information Technology",
            collegeId: MockCollege.id,
          })
        ).resolves.toEqual(MockDepartment);
      });

      test("Scenario: Duplicate Name", async () => {
        prismaMock.college.findFirstOrThrow.mockResolvedValueOnce(MockCollege);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);

        await expect(
          createDepartment({
            user: MockAdminUser,
            name: "Information Technology",
            collegeId: MockCollege.id,
          })
        ).rejects.toThrow("Department name is already used");
      });
    });

    test("Role: User", async () => {
      prismaMock.department.create.mockResolvedValueOnce(MockDepartment);

      await expect(
        createDepartment({
          user: MockNonAdminUser,
          name: "Information Technology",
          collegeId: MockCollege.id,
        })
      ).rejects.toThrow("You are not allowed to create a department");
    });
  });

  describe("Action: READ Departments", () => {
    test("Role: User", async () => {
      prismaMock.department.findMany.mockResolvedValueOnce([MockDepartment]);
      prismaMock.department.count.mockResolvedValueOnce(1);

      await expect(
        readDepartments({
          skip: 0,
          take: 10,
        })
      ).resolves.toEqual({
        count: 1,
        departments: [MockDepartment],
      });
    });
  });

  describe("Action: READ Department", () => {
    test("Role: User", async () => {
      prismaMock.department.findUnique.mockResolvedValueOnce(MockDepartment);

      expect(readDepartment({ id: MockDepartment.id })).resolves.toEqual(
        MockDepartment
      );
    });
  });

  describe("Action: UPDATE Department", () => {
    describe("Role: Admin", () => {
      test("Scenario: Unique Name", async () => {
        prismaMock.department.update.mockResolvedValueOnce(MockDepartment);

        expect(
          updateDepartment({
            id: MockDepartment.id,
            name: "Information Technology",
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockDepartment);
      });

      test("Scenario: Duplicate Name", async () => {
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.department.update.mockResolvedValueOnce(MockDepartment);

        expect(
          updateDepartment({
            id: MockDepartment.id,
            name: "Information Technology",
            user: MockAdminUser,
          })
        ).rejects.toThrow("Department name is already used");
      });
    });

    test("Role: User", async () => {
      prismaMock.department.update.mockResolvedValueOnce(MockDepartment);

      expect(
        updateDepartment({
          id: MockDepartment.id,
          name: "Information technology",
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to update this department");
    });
  });

  describe("Action: DELETE Department", () => {
    test("Role: Admin", async () => {
      prismaMock.department.delete.mockResolvedValueOnce(MockDepartment);

      expect(
        deleteDepartment({ id: MockDepartment.id, user: MockAdminUser })
      ).resolves.toEqual(MockDepartment);
    });

    test("Role: User", async () => {
      prismaMock.department.delete.mockResolvedValueOnce(MockDepartment);

      expect(
        deleteDepartment({ id: MockDepartment.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete this department");
    });
  });
});
