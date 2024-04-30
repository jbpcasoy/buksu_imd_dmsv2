import { prismaMock } from "@/prisma/singleton";
import {
  createCoordinator,
  deleteCoordinator,
  readCoordinator,
  readCoordinators,
} from "@/services/coordinatorService";
import {
  MockActiveFaculty,
  MockAdminUser,
  MockCoordinator,
  MockFaculty,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: Coordinator", () => {
  describe("Action: CREATE Coordinator", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to find existing Coordinator", async () => {
        prismaMock.coordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          createCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find existing Coordinator");
      });

      test("Scenario: Coordinator already exists", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);

        expect(
          createCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Coordinator already exists");
      });

      test("Scenario: Failed to find Faculty", async () => {
        prismaMock.faculty.findFirst.mockRejectedValueOnce(null);

        expect(
          createCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Faculty");
      });

      test("Scenario: Faculty not found", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(null);

        expect(
          createCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Faculty not found");
      });

      test("Scenario: Failed to create Coordinator", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.coordinator.create.mockRejectedValueOnce(null);

        expect(
          createCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create Coordinator");
      });

      test("Scenario: Success", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.coordinator.create.mockResolvedValueOnce(MockCoordinator);

        expect(
          createCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        );
      });
    });

    test("Role: User", async () => {
      expect(
        createCoordinator({
          activeFacultyId: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to create a coordinator");
    });
  });

  describe("Action: READ Coordinator", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find Coordinators", async () => {
        prismaMock.coordinator.findMany.mockRejectedValueOnce(null);

        expect(readCoordinators({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find Coordinators"
        );
      });

      test("Scenario: Failed to count Coordinators", async () => {
        prismaMock.coordinator.findMany.mockResolvedValueOnce([
          MockCoordinator,
        ]);
        prismaMock.coordinator.count.mockRejectedValueOnce(null);

        expect(readCoordinators({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count Coordinators"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.coordinator.findMany.mockResolvedValueOnce([
          MockCoordinator,
        ]);
        prismaMock.coordinator.count.mockResolvedValueOnce(1);

        expect(readCoordinators({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          coordinators: [MockCoordinator],
        });
      });
    });
  });

  describe("Action: READ Coordinator", () => {
    describe("Role: User", () => {
      test("Scenario: Coordinator not found", async () => {
        prismaMock.coordinator.findUniqueOrThrow.mockRejectedValueOnce(null);

        expect(readCoordinator({ id: MockCoordinator.id })).rejects.toThrow(
          "Coordinator not found"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.coordinator.findUniqueOrThrow.mockResolvedValueOnce(
          MockCoordinator
        );

        expect(readCoordinator({ id: MockCoordinator.id })).resolves.toEqual(
          MockCoordinator
        );
      });
    });
  });

  describe("Action: DELETE Coordinator", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete Coordinator", async () => {
        prismaMock.coordinator.delete.mockRejectedValueOnce(null);

        expect(
          deleteCoordinator({ id: MockCoordinator.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to delete Coordinator");
      });

      test("Scenario: Success", async () => {
        prismaMock.coordinator.delete.mockResolvedValueOnce(MockCoordinator);

        expect(
          deleteCoordinator({ id: MockCoordinator.id, user: MockAdminUser })
        ).resolves.toEqual(MockCoordinator);
      });
    });
  });
});
