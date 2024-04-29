import { prismaMock } from "@/prisma/singleton";
import {
  createFaculty,
  deleteFaculty,
  readFaculties,
  readFaculty,
} from "@/services/facultyService";
import {
  MockAdminUser,
  MockDepartment,
  MockFaculty,
  MockFacultyUser,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: Faculty", () => {
  describe("Action: CREATE Faculty", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to find existing Faculty", async () => {
        prismaMock.faculty.findFirst.mockRejectedValueOnce(null);

        expect(
          createFaculty({
            departmentId: MockDepartment.id,
            user: MockAdminUser,
            userId: MockFacultyUser.id,
          })
        ).rejects.toThrow("Failed to find existing Faculty");
      });

      test("Scenario: Duplicate Faculty", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.faculty.create.mockResolvedValueOnce(MockFaculty);

        expect(
          createFaculty({
            departmentId: MockDepartment.id,
            user: MockAdminUser,
            userId: MockFacultyUser.id,
          })
        ).rejects.toThrow("Faculty already exists");
      });

      test("Scenario: Failed to create Faculty", async () => {
        prismaMock.faculty.create.mockRejectedValueOnce(null);

        expect(
          createFaculty({
            departmentId: MockDepartment.id,
            user: MockAdminUser,
            userId: MockFacultyUser.id,
          })
        ).rejects.toThrow("Failed to create Faculty");
      });

      test("Scenario: Unique Faculty", async () => {
        prismaMock.faculty.create.mockResolvedValueOnce(MockFaculty);

        expect(
          createFaculty({
            departmentId: MockDepartment.id,
            user: MockAdminUser,
            userId: MockFacultyUser.id,
          })
        ).resolves.toEqual(MockFaculty);
      });
    });

    test("Role: User", async () => {
      prismaMock.faculty.create.mockResolvedValueOnce(MockFaculty);

      expect(
        createFaculty({
          departmentId: MockDepartment.id,
          user: MockNonAdminUser,
          userId: MockFacultyUser.id,
        })
      ).rejects.toThrow("You are not allowed to create a faculty");
    });
  });

  describe("Action: READ Faculties", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find Faculties", async () => {
        prismaMock.faculty.findMany.mockRejectedValueOnce(null);

        expect(readFaculties({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find Faculties"
        );
      });

      test("Scenario: Failed to count Faculties", async () => {
        prismaMock.faculty.findMany.mockResolvedValueOnce([MockFaculty]);
        prismaMock.faculty.count.mockRejectedValueOnce(null);

        expect(readFaculties({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count Faculties"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.faculty.findMany.mockResolvedValueOnce([MockFaculty]);
        prismaMock.faculty.count.mockResolvedValueOnce(1);

        expect(readFaculties({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          faculties: [MockFaculty],
        });
      });
    });
  });

  describe("Action: READ Faculty", () => {
    describe("Role: User", () => {
      test("Scenario: Faculty not found", async () => {
        prismaMock.faculty.findUnique.mockRejectedValueOnce(null);

        expect(readFaculty({ id: MockFaculty.id })).rejects.toThrow(
          "Faculty not found"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.faculty.findUnique.mockResolvedValueOnce(MockFaculty);

        expect(readFaculty({ id: MockFaculty.id })).resolves.toEqual(
          MockFaculty
        );
      });
    });
  });

  describe("Action: DELETE Faculty", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete Faculty", async () => {
        prismaMock.faculty.delete.mockRejectedValueOnce(null);

        expect(
          deleteFaculty({ user: MockAdminUser, id: MockFaculty.id })
        ).rejects.toThrow("Failed to ");
      });

      test("Scenario: Success", async () => {
        prismaMock.faculty.delete.mockResolvedValueOnce(MockFaculty);

        expect(
          deleteFaculty({ user: MockAdminUser, id: MockFaculty.id })
        ).resolves.toEqual(MockFaculty);
      });
    });

    test("Role: User", async () => {
      prismaMock.faculty.delete.mockResolvedValueOnce(MockFaculty);

      expect(
        deleteFaculty({ id: MockFaculty.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete this faculty");
    });
  });
});
