import { prismaMock } from "@/prisma/singleton";
import {
  createActiveIDDCoordinator,
  deleteActiveIDDCoordinator,
  readActiveIDDCoordinator,
  readActiveIDDCoordinatorByIDDCoordinator,
  readActiveIDDCoordinatorByUser,
  readActiveIDDCoordinators,
} from "@/services/activeIDDCoordinatorService";
import {
  MockActiveIDDCoordinator,
  MockAdminUser,
  MockIDDCoordinator,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ActiveIDDCoordinator", () => {
  describe("Action: CREATE ActiveIDDCoordinator", () => {
    test("Role: User", async () => {
      expect(
        createActiveIDDCoordinator({
          user: MockNonAdminUser,
          iDDCoordinatorId: MockIDDCoordinator.id,
        })
      ).rejects.toThrow("You are not allowed to set an active IDD coordinator");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to find IDDCoordinator", async () => {
        prismaMock.iDDCoordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveIDDCoordinator({
            user: MockAdminUser,
            iDDCoordinatorId: MockIDDCoordinator.id,
          })
        ).rejects.toThrow("Failed to find IDDCoordinator");
      });

      test("Scenario: IDDCoordinator not found", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveIDDCoordinator({
            user: MockAdminUser,
            iDDCoordinatorId: MockIDDCoordinator.id,
          })
        ).rejects.toThrow("IDDCoordinator not found");
      });

      test("Scenario: Failed to count active IDDCoordinator", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(
          MockIDDCoordinator
        );
        prismaMock.activeIDDCoordinator.count.mockRejectedValueOnce(null);

        expect(
          createActiveIDDCoordinator({
            user: MockAdminUser,
            iDDCoordinatorId: MockIDDCoordinator.id,
          })
        ).rejects.toThrow("Failed to count active IDDCoordinator");
      });
      test("Scenario: There can only be one active IDDCoordinator", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(
          MockIDDCoordinator
        );
        prismaMock.activeIDDCoordinator.count.mockResolvedValueOnce(1);

        expect(
          createActiveIDDCoordinator({
            user: MockAdminUser,
            iDDCoordinatorId: MockIDDCoordinator.id,
          })
        ).rejects.toThrow("There can only be one active IDDCoordinator");
      });
      test("Scenario: Failed to create ActiveIDDCoordinator", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(
          MockIDDCoordinator
        );
        prismaMock.activeIDDCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.activeIDDCoordinator.create.mockRejectedValueOnce(null);

        expect(
          createActiveIDDCoordinator({
            user: MockAdminUser,
            iDDCoordinatorId: MockIDDCoordinator.id,
          })
        ).rejects.toThrow("Failed to create ActiveIDDCoordinator");
      });
      test("Scenario: Success", async () => {
        prismaMock.iDDCoordinator.findFirst.mockResolvedValueOnce(
          MockIDDCoordinator
        );
        prismaMock.activeIDDCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.activeIDDCoordinator.create.mockResolvedValueOnce(
          MockActiveIDDCoordinator
        );

        expect(
          createActiveIDDCoordinator({
            user: MockAdminUser,
            iDDCoordinatorId: MockIDDCoordinator.id,
          })
        ).resolves.toEqual(MockActiveIDDCoordinator);
      });
    });
  });

  describe("Action: READ ActiveIDDCoordinators", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveIDDCoordinators", async () => {
        prismaMock.activeIDDCoordinator.findMany.mockRejectedValueOnce(null);

        expect(
          readActiveIDDCoordinators({ skip: 0, take: 10 })
        ).rejects.toThrow("Failed to find ActiveIDDCoordinators");
      });
      test("Scenario: Failed to count ActiveIDDCoordinators", async () => {
        prismaMock.activeIDDCoordinator.findMany.mockResolvedValueOnce([
          MockActiveIDDCoordinator,
        ]);
        prismaMock.activeIDDCoordinator.count.mockRejectedValueOnce(null);

        expect(
          readActiveIDDCoordinators({ skip: 0, take: 10 })
        ).rejects.toThrow("Failed to count ActiveIDDCoordinators");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeIDDCoordinator.findMany.mockResolvedValueOnce([
          MockActiveIDDCoordinator,
        ]);
        prismaMock.activeIDDCoordinator.count.mockResolvedValueOnce(1);

        expect(
          readActiveIDDCoordinators({ skip: 0, take: 10 })
        ).resolves.toEqual({
          count: 1,
          activeIDDCoordinators: [MockActiveIDDCoordinator],
        });
      });
    });
  });

  describe("Action: READ ActiveIDDCoordinator by User", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveIDDCoordinator for this User", async () => {
        prismaMock.activeIDDCoordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveIDDCoordinatorByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("Failed to find ActiveIDDCoordinator for this User");
      });
      test("Scenario: ActiveIDDCoordinator not found", async () => {
        prismaMock.activeIDDCoordinator.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveIDDCoordinatorByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("ActiveIDDCoordinator not found");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeIDDCoordinator.findFirst.mockResolvedValueOnce(
          MockActiveIDDCoordinator
        );

        expect(
          readActiveIDDCoordinatorByUser({ user: MockNonAdminUser })
        ).resolves.toEqual(MockActiveIDDCoordinator);
      });
    });
  });

  describe("Action: READ ActiveIDDCoordinator by IDDCoordinator", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveIDDCoordinator for this IDDCoordinator", async () => {
        prismaMock.activeIDDCoordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveIDDCoordinatorByIDDCoordinator({
            id: MockIDDCoordinator.id,
          })
        ).rejects.toThrow(
          "Failed to find ActiveIDDCoordinator for this IDDCoordinator"
        );
      });

      test("Scenario: ActiveIDDCoordinator not found for this IDDCoordinator", async () => {
        prismaMock.activeIDDCoordinator.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveIDDCoordinatorByIDDCoordinator({
            id: MockIDDCoordinator.id,
          })
        ).rejects.toThrow(
          "ActiveIDDCoordinator not found for this IDDCoordinator"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.activeIDDCoordinator.findFirst.mockResolvedValue(
          MockActiveIDDCoordinator
        );

        expect(
          readActiveIDDCoordinatorByIDDCoordinator({
            id: MockIDDCoordinator.id,
          })
        ).resolves.toEqual(MockActiveIDDCoordinator);
      });
    });
  });

  describe("Action: READ ActiveIDDCoordinator", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveIDDCoordinator not found", async () => {
        prismaMock.activeIDDCoordinator.findUniqueOrThrow.mockRejectedValueOnce(
          null
        );

        expect(
          readActiveIDDCoordinator({ id: MockActiveIDDCoordinator.id })
        ).rejects.toThrow("ActiveIDDCoordinator not found");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeIDDCoordinator.findUniqueOrThrow.mockResolvedValueOnce(
          MockActiveIDDCoordinator
        );

        expect(
          readActiveIDDCoordinator({ id: MockActiveIDDCoordinator.id })
        ).resolves.toEqual(MockActiveIDDCoordinator);
      });
    });
  });

  describe("Action: DELETE ActionIDDCoordinator", () => {
    test("Role: User", async () => {
      expect(
        deleteActiveIDDCoordinator({
          id: MockActiveIDDCoordinator.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow(
        "You are not allowed to remove an active IDD coordinator"
      );
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to delete ActiveIDDCoordinator", async () => {
        prismaMock.activeIDDCoordinator.delete.mockRejectedValue(null);

        expect(
          deleteActiveIDDCoordinator({
            id: MockActiveIDDCoordinator.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to delete ActiveIDDCoordinator");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeIDDCoordinator.delete.mockResolvedValueOnce(
          MockActiveIDDCoordinator
        );

        expect(
          deleteActiveIDDCoordinator({
            id: MockActiveIDDCoordinator.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveIDDCoordinator);
      });
    });
  });
});
