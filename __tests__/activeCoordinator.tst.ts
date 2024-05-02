import { prismaMock } from "@/prisma/singleton";
import {
  createActiveCoordinator,
  deleteActiveCoordinator,
  readActiveCoordinator,
  readActiveCoordinatorByCoordinator,
  readActiveCoordinatorByUser,
  readActiveCoordinators,
} from "@/services/activeCoordinatorService";
import {
  MockActiveCoordinator,
  MockActiveFaculty,
  MockAdminUser,
  MockCoordinator,
  MockDepartment,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ActiveCoordinator", () => {
  describe("Action: CREATE ActiveCoordinator", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to find Coordinator", async () => {
        prismaMock.coordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Coordinator");
      });
      test("Scenario: Coordinator not found", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.facultyId,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Coordinator not found");
      });

      test("Scenario: Failed to count ActiveCoordinator", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockRejectedValueOnce(null);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to count ActiveCoordinator");
      });
      test("Scenario: Faculty can only be an active coordinator on one department", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(1);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Faculty can only be an active coordinator on one department"
        );
      });

      test("Scenario: Failed to find Department", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Department");
      });
      test("Scenario: Department not found", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Department not found");
      });

      test("Scenario: Failed to count ActiveCoordinator for this Department", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeCoordinator.count.mockRejectedValueOnce(null);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Failed to count ActiveCoordinator for this Department"
        );
      });
      test("Scenario: Department can only have one active coordinator", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(1);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Department can only have one active coordinator");
      });

      test("Scenario: Failed to create active coordinator", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.activeCoordinator.create.mockRejectedValueOnce(null);

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create ActiveCoordinator");
      });
      test("Scenario: Success", async () => {
        prismaMock.coordinator.findFirst.mockResolvedValueOnce(MockCoordinator);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeCoordinator.count.mockResolvedValueOnce(0);
        prismaMock.activeCoordinator.create.mockResolvedValueOnce(
          MockActiveCoordinator
        );

        expect(
          createActiveCoordinator({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveCoordinator);
      });
    });

    test("Role: User", async () => {
      expect(
        createActiveCoordinator({
          activeFacultyId: MockActiveCoordinator.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to set an active coordinator");
    });
  });

  describe("Action: READ ActiveCoordinators", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveCoordinators", async () => {
        prismaMock.activeCoordinator.findMany.mockRejectedValue(null);

        expect(readActiveCoordinators({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find ActiveCoordinators"
        );
      });

      test("Scenario: Failed to count ActiveCoordinators", async () => {
        prismaMock.activeCoordinator.findMany.mockResolvedValue([
          MockActiveCoordinator,
        ]);
        prismaMock.activeCoordinator.count.mockRejectedValue(null);

        expect(readActiveCoordinators({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count ActiveCoordinator"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.activeCoordinator.findMany.mockResolvedValue([
          MockActiveCoordinator,
        ]);
        prismaMock.activeCoordinator.count.mockResolvedValue(1);

        expect(readActiveCoordinators({ skip: 0, take: 10 })).resolves.toEqual({
          activeCoordinators: [MockActiveCoordinator],
          count: 1,
        });
      });
    });
  });

  describe("Action: READ ActiveCoordinator by User", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveCoordinator for this User", async () => {
        prismaMock.activeCoordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveCoordinatorByUser({
            user: MockNonAdminUser,
          })
        ).rejects.toThrow("Failed to find ActiveCoordinator for this User");
      });
      test("Scenario: ActiveCoordinator not found for this User", async () => {
        prismaMock.activeCoordinator.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveCoordinatorByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("ActiveCoordinator not found for this User");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeCoordinator.findFirst.mockResolvedValueOnce(
          MockActiveCoordinator
        );

        expect(
          readActiveCoordinatorByUser({ user: MockNonAdminUser })
        ).resolves.toEqual(MockActiveCoordinator);
      });
    });
  });

  describe("Action: READ ActiveCoordinator by Coordinator", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveCoordinator for this Coordinator", async () => {
        prismaMock.activeCoordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveCoordinatorByCoordinator({ id: MockCoordinator.id })
        ).rejects.toThrow(
          "Failed to find ActiveCoordinator for this Coordinator"
        );
      });

      test("Scenario: ActiveCoordinator not found for this Coordinator", async () => {
        prismaMock.activeCoordinator.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveCoordinatorByCoordinator({ id: MockCoordinator.id })
        ).rejects.toThrow("ActiveCoordinator not found for this Coordinator");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeCoordinator.findFirst.mockResolvedValue(
          MockActiveCoordinator
        );

        expect(
          readActiveCoordinatorByCoordinator({ id: MockCoordinator.id })
        ).resolves.toEqual(MockActiveCoordinator);
      });
    });
  });

  describe("Action: READ ActiveCoordinator", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveCoordinator not found", async () => {
        prismaMock.activeCoordinator.findUniqueOrThrow.mockRejectedValue(null);

        expect(
          readActiveCoordinator({
            id: MockActiveCoordinator.id,
          })
        ).rejects.toThrow("ActiveCoordinator not found");
      });
    });
  });

  describe("Action: DELETE ActiveCoordinator", () => {
    test("Role: User", async () => {
      expect(
        deleteActiveCoordinator({
          id: MockActiveCoordinator.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to remove an active coordinator");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to delete ActiveCoordinator", () => {
        prismaMock.activeCoordinator.delete.mockRejectedValueOnce(null);

        expect(
          deleteActiveCoordinator({
            id: MockActiveCoordinator.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to delete ActiveCoordinator");
      });

      test("Scenario: Success", () => {
        prismaMock.activeCoordinator.delete.mockResolvedValueOnce(
          MockActiveCoordinator
        );

        expect(
          deleteActiveCoordinator({
            id: MockActiveCoordinator.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveCoordinator);
      });
    });
  });
});
