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
      test("Scenario: Failed to find Faculty", async () => {
        prismaMock.faculty.findFirst.mockRejectedValueOnce(null);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Faculty");
      });

      test("Scenario: Faculty not found", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(null);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Faculty not found");
      });

      test("Scenario: Failed to find existing Chairperson", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.chairperson.findFirst.mockRejectedValueOnce(MockChairperson);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find existing Chairperson");
      });

      test("Scenario: Unique Chairperson", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.chairperson.create.mockResolvedValueOnce(MockChairperson);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockChairperson);
      });

      test("Scenario: Duplicate Chairperson", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Chairperson already exists");
      });

      test("Scenario: Failed to create", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.chairperson.create.mockRejectedValueOnce(null);

        expect(
          createChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create Chairperson");
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
    describe("Role: User", () => {
      test("Scenario: Failed to find chairpersons", async () => {
        prismaMock.chairperson.findMany.mockRejectedValueOnce(null);

        expect(readChairpersons({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find chairpersons"
        );
      });

      test("Scenario: Failed to count chairpersons", async () => {
        prismaMock.chairperson.count.mockRejectedValueOnce(null);

        expect(readChairpersons({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count chairpersons"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.chairperson.findMany.mockResolvedValueOnce([
          MockChairperson,
        ]);
        prismaMock.chairperson.count.mockResolvedValueOnce(1);

        expect(readChairpersons({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          chairpersons: [MockChairperson],
        });
      });
    });
  });

  describe("Action: READ Chairperson", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find chairperson", async () => {
        prismaMock.chairperson.findUnique.mockRejectedValueOnce(
          MockChairperson
        );

        expect(readChairperson({ id: MockChairperson.id })).rejects.toThrow(
          "Failed to find chairperson"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.chairperson.findUnique.mockResolvedValueOnce(
          MockChairperson
        );

        expect(readChairperson({ id: MockChairperson.id })).resolves.toEqual(
          MockChairperson
        );
      });
    });
  });

  describe("Action: DELETE Chairperson", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete chairperson", async () => {
        prismaMock.chairperson.delete.mockRejectedValueOnce(null);

        expect(
          deleteChairperson({ id: MockChairperson.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to delete chairperson");
      });

      test("Scenario: Success", async () => {
        prismaMock.chairperson.delete.mockResolvedValueOnce(MockChairperson);

        expect(
          deleteChairperson({ id: MockChairperson.id, user: MockAdminUser })
        ).resolves.toEqual(MockChairperson);
      });
    });

    test("Role: User", async () => {
      expect(
        deleteChairperson({ id: MockChairperson.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete this chairperson");
    });
  });
});
