import { prismaMock } from "@/prisma/singleton";
import {
  createChairperson,
  deleteChairperson,
  readChairperson,
  readChairpersons,
} from "@/services/chairpersonService";
import {
  MockActiveFaculty,
  MockAdminUser,
  MockChairperson,
  MockFaculty,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: Chairperson", () => {
  describe("Action: CREATE Chairperson", () => {
    describe("Role: Admin", () => {
      test("Scenario: Unique Chairperson", async () => {
        prismaMock.faculty.findFirstOrThrow.mockResolvedValueOnce(MockFaculty);
        prismaMock.chairperson.create.mockResolvedValueOnce(MockChairperson);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockChairperson);
      });

      test("Scenario: Duplicate Chairperson", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Chairperson already exists");
      });
    });

    test("Role: User", async () => {
      expect(
        createChairperson({
          activeFacultyId: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to create a chairperson");
    });
  });

  describe("Action: READ Chairpersons", () => {
    test("Role: User", async () => {
      prismaMock.chairperson.findMany.mockResolvedValueOnce([MockChairperson]);
      prismaMock.chairperson.count.mockResolvedValueOnce(1);

      expect(readChairpersons({ skip: 0, take: 10 })).resolves.toEqual({
        count: 1,
        chairpersons: [MockChairperson],
      });
    });
  });

  describe("Action: READ Chairperson", () => {
    test("Role: User", async () => {
      prismaMock.chairperson.findUnique.mockResolvedValueOnce(MockChairperson);

      expect(readChairperson({ id: MockChairperson.id })).resolves.toEqual(
        MockChairperson
      );
    });
  });

  describe("Action: DELETE Chairperson", () => {
    test("Role: Admin", async () => {
      prismaMock.chairperson.delete.mockResolvedValueOnce(MockChairperson);

      expect(
        deleteChairperson({ id: MockChairperson.id, user: MockAdminUser })
      ).resolves.toEqual(MockChairperson);
    });

    test("Role: User", async () => {
      expect(
        deleteChairperson({ id: MockChairperson.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete this chairperson");
    });
  });
});
