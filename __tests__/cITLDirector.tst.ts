import { prismaMock } from "@/prisma/singleton";
import {
  createCITLDirector,
  deleteCITLDirector,
  readCITLDirector,
  readCITLDirectors,
} from "@/services/cITLDirectorService";
import {
  MockAdminUser,
  MockCITLDirector,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: CITLDirector", () => {
  describe("Action: CREATE CITLDirector", () => {
    test("Role: User", () => {
      expect(
        createCITLDirector({
          user: MockNonAdminUser,
          userId: MockNonAdminUser.id,
        })
      ).rejects.toThrow("You are not allowed to create a CITL director");
    });
    describe("Role: Admin", () => {
      test("Scenario: Failed to find CITLDirector", async () => {
        prismaMock.cITLDirector.findFirst.mockRejectedValueOnce(null);

        expect(
          createCITLDirector({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).rejects.toThrow("Failed to find CITLDirector");
      });
      test("Scenario: CITLDirector already exists", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(
          MockCITLDirector
        );

        expect(
          createCITLDirector({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).rejects.toThrow("CITLDirector already exists");
      });

      test("Scenario: Failed to create CITLDirector", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(null);
        prismaMock.cITLDirector.create.mockRejectedValueOnce(null);

        expect(
          createCITLDirector({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).rejects.toThrow("Failed to create CITLDirector");
      });
      test("Scenario: Success", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(null);
        prismaMock.cITLDirector.create.mockResolvedValueOnce(MockCITLDirector);
        expect(
          createCITLDirector({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).resolves.toEqual(MockCITLDirector);
      });
    });
  });

  describe("Action: READ CITLDirectors", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find CITLDirectors", async () => {
        prismaMock.cITLDirector.findMany.mockRejectedValueOnce(null);

        expect(readCITLDirectors({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find CITLDirectors"
        );
      });
      test("Scenario: Failed to count CITLDirector", async () => {
        prismaMock.cITLDirector.findMany.mockResolvedValueOnce([
          MockCITLDirector,
        ]);
        prismaMock.cITLDirector.count.mockRejectedValueOnce(null);

        expect(readCITLDirectors({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count CITLDirectors"
        );
      });
      test("Scenario: Success", async () => {
        prismaMock.cITLDirector.findMany.mockResolvedValueOnce([
          MockCITLDirector,
        ]);
        prismaMock.cITLDirector.count.mockResolvedValueOnce(1);

        expect(readCITLDirectors({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          cITLDirectors: [MockCITLDirector],
        });
      });
    });
  });

  describe("Action: READ CITLDirector", () => {
    describe("Role: User", () => {
      test("Scenario: CITLDirector not found", async () => {
        prismaMock.cITLDirector.findUniqueOrThrow.mockRejectedValueOnce(null);

        expect(readCITLDirector({ id: MockCITLDirector.id })).rejects.toThrow(
          "CITLDirector not found"
        );
      });
      test("Scenario: Success", async () => {
        prismaMock.cITLDirector.findUniqueOrThrow.mockResolvedValueOnce(
          MockCITLDirector
        );

        expect(readCITLDirector({ id: MockCITLDirector.id })).resolves.toEqual(
          MockCITLDirector
        );
      });
    });
  });

  describe("Action: DELETE CITLDirector", () => {
    test("Role: User", () => {
      expect(
        deleteCITLDirector({ id: MockCITLDirector.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to delete CITL director");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to delete CITLDirector", async () => {
        prismaMock.cITLDirector.delete.mockRejectedValueOnce(null);

        expect(
          deleteCITLDirector({ id: MockCITLDirector.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to delete CITLDirector");
      });
      test("Scenario: Success", async () => {
        prismaMock.cITLDirector.delete.mockResolvedValueOnce(MockCITLDirector);

        expect(
          deleteCITLDirector({ id: MockCITLDirector.id, user: MockAdminUser })
        ).resolves.toEqual(MockCITLDirector);
      });
    });
  });
});
