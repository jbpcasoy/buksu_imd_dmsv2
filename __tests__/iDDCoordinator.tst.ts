import { prismaMock } from "@/prisma/singleton";
import {
  createIDDCoordinator,
  deleteIDDCoordinator,
  readIDDCoordinator,
  readIDDCoordinators,
} from "@/services/iDDCoordinatorService";
import {
  MockAdminUser,
  MockIDDCoordinator,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: IDDCoordinator", () => {
  describe("Action: CREATE IDDCoordinator", () => {
    test("Role: User", async () => {
      expect(
        createIDDCoordinator({
          user: MockNonAdminUser,
          userId: MockNonAdminUser.id,
        })
      ).rejects.toThrow("You are not allowed to create an IDD coordinator");
    });
    describe("Role: Admin", () => {
      test("Scenario: Failed to find existing IDD Coordinator", async () => {
        prismaMock.iDDCoordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          createIDDCoordinator({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).rejects.toThrow("Failed to find existing IDD Coordinator");
      });

      test("Scenario: IDD coordinator already exists", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(
          MockIDDCoordinator
        );

        expect(
          createIDDCoordinator({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).rejects.toThrow("IDD coordinator already exists");
      });

      test("Scenario: Failed to create IDDCoordinator", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(null);
        prismaMock.iDDCoordinator.create.mockRejectedValueOnce(null);

        expect(
          createIDDCoordinator({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).rejects.toThrow("Failed to create IDDCoordinator");
      });

      test("Scenario: Success", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(null);
        prismaMock.iDDCoordinator.create.mockResolvedValueOnce(
          MockIDDCoordinator
        );

        expect(
          createIDDCoordinator({
            user: MockAdminUser,
            userId: MockNonAdminUser.id,
          })
        ).resolves.toEqual(MockIDDCoordinator);
      });
    });
  });

  describe("Action: READ IDDCoordinators", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find IDDCoordinators", async () => {
        prismaMock.iDDCoordinator.findMany.mockRejectedValueOnce(null);

        expect(readIDDCoordinators({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find IDDCoordinators"
        );
      });
      test("Scenario: Failed to count IDDCoordinators", async () => {
        prismaMock.iDDCoordinator.findMany.mockResolvedValueOnce([
          MockIDDCoordinator,
        ]);
        prismaMock.iDDCoordinator.count.mockRejectedValueOnce(null);

        expect(readIDDCoordinators({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count IDDCoordinators"
        );
      });
      test("Scenario: Success", async () => {
        prismaMock.iDDCoordinator.findMany.mockResolvedValueOnce([
          MockIDDCoordinator,
        ]);
        prismaMock.iDDCoordinator.count.mockResolvedValueOnce(1);

        expect(readIDDCoordinators({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          iDDCoordinators: [MockIDDCoordinator],
        });
      });
    });
  });

  describe("Action: READ IDDCoordinator", () => {
    describe("Role: User", () => {
      test("Scenario: IDDCoordinator not found", async () => {
        prismaMock.iDDCoordinator.findUniqueOrThrow.mockRejectedValueOnce(null);

        expect(
          readIDDCoordinator({ id: MockIDDCoordinator.id })
        ).rejects.toThrow("IDDCoordinator not found");
      });
      test("Scenario: IDDCoordinator not found", async () => {
        prismaMock.iDDCoordinator.findUniqueOrThrow.mockResolvedValueOnce(
          MockIDDCoordinator
        );

        expect(
          readIDDCoordinator({ id: MockIDDCoordinator.id })
        ).resolves.toEqual(MockIDDCoordinator);
      });
    });
  });

  describe("Action: DELETE IDDCoordinator", () => {
    test("Role: User", async () => {
      expect(
        deleteIDDCoordinator({
          id: MockIDDCoordinator.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to delete this IDD coordinator");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to delete IDDCoordinator", async () => {
        prismaMock.iDDCoordinator.delete.mockRejectedValueOnce(null);

        expect(
          deleteIDDCoordinator({
            id: MockIDDCoordinator.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to delete IDDCoordinator");
      });
      test("Scenario: Success", async () => {
        prismaMock.iDDCoordinator.delete.mockResolvedValueOnce(
          MockIDDCoordinator
        );

        expect(
          deleteIDDCoordinator({
            id: MockIDDCoordinator.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockIDDCoordinator);
      });
    });
  });
});
