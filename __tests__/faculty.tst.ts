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
    test("Role: User", async () => {
      prismaMock.faculty.findMany.mockResolvedValueOnce([MockFaculty]);
      prismaMock.faculty.count.mockResolvedValueOnce(1);

      expect(readFaculties({ skip: 0, take: 10 })).resolves.toEqual({
        count: 1,
        faculties: [MockFaculty],
      });
    });
  });

  describe("Action: READ Faculty", () => {
    test("Role: User", async () => {
      prismaMock.faculty.findUnique.mockResolvedValueOnce(MockFaculty);

      expect(readFaculty({ id: MockFaculty.id })).resolves.toEqual(MockFaculty);
    });
  });

  describe("Action: DELETE Faculty", () => {
    test("Role: Admin", async () => {
      prismaMock.faculty.delete.mockResolvedValueOnce(MockFaculty);

      expect(
        deleteFaculty({ user: MockAdminUser, id: MockFaculty.id })
      ).resolves.toEqual(MockFaculty);
    });
    test("Role: User", async () => {
      prismaMock.faculty.delete.mockResolvedValueOnce(MockFaculty);

      expect(
        deleteFaculty({ id: MockFaculty.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete this faculty");
    });
  });
});
