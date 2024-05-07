import { prismaMock } from "@/prisma/singleton";
import {
  createDean,
  deleteDean,
  readDean,
  readDeans,
} from "@/services/deanService.tst";
import {
  MockActiveFaculty,
  MockAdminUser,
  MockDean,
  MockFaculty,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: Dean", () => {
  describe("Action: CREATE Dean", () => {
    test("Role: User", async () => {
      expect(
        createDean({
          activeFacultyId: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to create a dean");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to find Dean", async () => {
        prismaMock.dean.findFirst.mockRejectedValueOnce(MockDean);

        expect(
          createDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Dean");
      });

      test("Scenario: Dean already exists", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);

        expect(
          createDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Dean already exists");
      });

      test("Scenario: Failed to find Faculty", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(null);
        prismaMock.faculty.findFirst.mockRejectedValueOnce(null);

        expect(
          createDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Faculty");
      });

      test("Scenario: Faculty not found", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(null);
        prismaMock.faculty.findFirst.mockResolvedValueOnce(null);

        expect(
          createDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Faculty not found");
      });

      test("Scenario: Failed to create Dean", () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(null);
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.dean.create.mockRejectedValueOnce(MockDean);

        expect(
          createDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to delete Dean");
      });

      test("Scenario: Success", () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(null);
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.dean.create.mockResolvedValueOnce(MockDean);

        expect(
          createDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockDean);
      });
    });
  });

  describe("Action: READ Deans", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find Deans", async () => {
        prismaMock.dean.findMany.mockRejectedValueOnce(null);

        expect(readDeans({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find Deans"
        );
      });

      test("Scenario: Failed to count Deans", async () => {
        prismaMock.dean.findMany.mockResolvedValueOnce([MockDean]);
        prismaMock.dean.count.mockRejectedValueOnce(null);

        expect(readDeans({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count Deans"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.dean.findMany.mockResolvedValueOnce([MockDean]);
        prismaMock.dean.count.mockResolvedValueOnce(1);

        expect(readDeans({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          deans: [MockDean],
        });
      });
    });
  });

  describe("Action: READ Dean", () => {
    describe("Role: User", () => {
      test("Scenario: Dean not found", async () => {
        prismaMock.dean.findUniqueOrThrow.mockRejectedValueOnce(null);

        expect(readDean({ id: MockDean.id })).rejects.toThrow("Dean not found");
      });

      test("Scenario: Success", async () => {
        prismaMock.dean.findUniqueOrThrow.mockResolvedValueOnce(MockDean);

        expect(readDean({ id: MockDean.id })).resolves.toEqual(MockDean);
      });
    });
  });

  describe("Action: DELETE Dean", () => {
    test("Role: User", async () => {
      expect(
        deleteDean({ id: MockDean.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete this dean");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to delete Dean", async () => {
        prismaMock.dean.delete.mockRejectedValueOnce(null);

        expect(
          deleteDean({ id: MockDean.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to delete Dean");
      });

      test("Scenario: Success", async () => {
        prismaMock.dean.delete.mockResolvedValueOnce(MockDean);

        expect(
          deleteDean({ id: MockDean.id, user: MockAdminUser })
        ).resolves.toEqual(MockDean);
      });
    });
  });
});
