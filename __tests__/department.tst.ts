import { prismaMock } from "@/prisma/singleton";
import {
  createDepartment,
  deleteDepartment,
  readDepartment,
  readDepartmentByUser,
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
      test("Scenario: Failed to find existing Department", async () => {
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.department.findFirst.mockRejectedValueOnce(null);

        expect(
          createDepartment({
            user: MockAdminUser,
            name: "Information Technology",
            collegeId: MockCollege.id,
          })
        ).rejects.toThrow("Failed to find existing Department");
      });

      test("Scenario: Duplicate Name", async () => {
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);

        expect(
          createDepartment({
            user: MockAdminUser,
            name: "Information Technology",
            collegeId: MockCollege.id,
          })
        ).rejects.toThrow("Department name is already used");
      });

      test("Scenario: Failed to find College", async () => {
        prismaMock.college.findFirst.mockRejectedValueOnce(null);

        expect(
          createDepartment({
            collegeId: MockCollege.id,
            name: "Information Technology",
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find College");
      });

      test("Scenario: College not found", async () => {
        prismaMock.college.findFirst.mockResolvedValueOnce(null);

        expect(
          createDepartment({
            collegeId: MockCollege.id,
            name: "Information Technology",
            user: MockAdminUser,
          })
        ).rejects.toThrow("College not found");
      });

      test("Scenario: Unique Name", async () => {
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.department.create.mockResolvedValueOnce(MockDepartment);

        expect(
          createDepartment({
            user: MockAdminUser,
            name: "Information Technology",
            collegeId: MockCollege.id,
          })
        ).resolves.toEqual(MockDepartment);
      });

      test("Scenario: Failed to create Department", async () => {
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.department.create.mockRejectedValueOnce(null);

        expect(
          createDepartment({
            user: MockAdminUser,
            name: "Information Technology",
            collegeId: MockCollege.id,
          })
        ).rejects.toThrow("Failed to create Department");
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
    describe("Role: User", () => {
      test("Scenario: Failed to find Departments", async () => {
        prismaMock.department.findMany.mockRejectedValueOnce(null);

        await expect(
          readDepartments({
            skip: 0,
            take: 10,
          })
        ).rejects.toThrow("Failed to find Departments");
      });

      test("Scenario: Failed to count Departments", async () => {
        prismaMock.department.findMany.mockResolvedValueOnce([MockDepartment]);
        prismaMock.department.count.mockRejectedValueOnce(null);

        await expect(
          readDepartments({
            skip: 0,
            take: 10,
          })
        ).rejects.toThrow("Failed to count departments");
      });

      test("Scenario: Success", async () => {
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
  });

  describe("Action: READ Department", () => {
    describe("Role: User", () => {
      test("Scenario: Department not found", async () => {
        prismaMock.department.findUnique.mockRejectedValueOnce(null);

        expect(readDepartment({ id: MockDepartment.id })).rejects.toThrow(
          "Department not found"
        );
      });
      test("Scenario: Success", async () => {
        prismaMock.department.findUnique.mockResolvedValueOnce(MockDepartment);

        expect(readDepartment({ id: MockDepartment.id })).resolves.toEqual(
          MockDepartment
        );
      });
    });
  });

  describe("Action: READ Department By User", () => {
    describe("Role: User", () => {
      test("Scenario: Department not found for that user", async () => {
        prismaMock.department.findFirst.mockRejectedValueOnce(null);

        expect(
          readDepartmentByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("Failed to find Department");
      });
      test("Scenario: Success", async () => {
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);

        expect(
          readDepartmentByUser({ user: MockNonAdminUser })
        ).resolves.toEqual(MockDepartment);
      });
    });
  });

  describe("Action: UPDATE Department", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to find existing Department", async () => {
        prismaMock.department.findFirst.mockRejectedValueOnce(null);

        expect(
          updateDepartment({
            id: MockDepartment.id,
            name: "Information Technology",
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find existing Department");
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
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete Department", async () => {
        prismaMock.department.delete.mockRejectedValueOnce(null);

        expect(
          deleteDepartment({ id: MockDepartment.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to delete Department");
      });

      test("Scenario: Success", async () => {
        prismaMock.department.delete.mockResolvedValueOnce(MockDepartment);

        expect(
          deleteDepartment({ id: MockDepartment.id, user: MockAdminUser })
        ).resolves.toEqual(MockDepartment);
      });
    });

    test("Role: User", async () => {
      prismaMock.department.delete.mockResolvedValueOnce(MockDepartment);

      expect(
        deleteDepartment({ id: MockDepartment.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete this department");
    });
  });
});
