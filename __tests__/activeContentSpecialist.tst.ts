import { prismaMock } from "@/prisma/singleton";
import {
  createActiveContentSpecialist,
  deleteActiveContentSpecialist,
  readActiveContentSpecialist,
  readActiveContentSpecialistByContentSpecialist,
  readActiveContentSpecialistByUser,
  readActiveContentSpecialists,
} from "@/services/activeContentSpecialistService";
import {
  MockActiveContentSpecialist,
  MockActiveFaculty,
  MockAdminUser,
  MockContentSpecialist,
  MockDepartment,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ActiveContentSpecialist", () => {
  describe("Action: CREATE ActiveContentSpecialist", () => {
    test("Role: User", async () => {
      expect(
        createActiveContentSpecialist({
          activeFacultyId: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow(
        "You are not allowed to set an active content specialist"
      );
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to find ContentSpecialist", async () => {
        prismaMock.contentSpecialist.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find ContentSpecialist");
      });
      test("Scenario: ContentSpecialist not found", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("ContentSpecialist not found");
      });

      test("Scenario: Failed to count ActiveContentSpecialist for this ContentSpecialist", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockRejectedValueOnce(null);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Failed to count ActiveContentSpecialist for this ContentSpecialist"
        );
      });
      test("Scenario: Faculty can only be an active content specialist on one department", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(1);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Faculty can only be an active content specialist on one department"
        );
      });

      test("Scenario: Failed to find Department", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Department");
      });
      test("Scenario: Department not found", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Department not found");
      });

      test("Scenario: Failed to count ActiveContentSpecialist for this Department", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeContentSpecialist.count.mockRejectedValueOnce(null);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Failed to count ActiveContentSpecialist for this Department"
        );
      });
      test("Scenario: Department can only have one active content specialist", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(1);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Department can only have one active content specialist"
        );
      });

      test("Scenario: Failed to create ActiveContentSpecialist", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.activeContentSpecialist.create.mockRejectedValueOnce(null);

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create ActiveContentSpecialist");
      });
      test("Scenario: Success", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(0);
        prismaMock.activeContentSpecialist.create.mockResolvedValueOnce(
          MockActiveContentSpecialist
        );

        expect(
          createActiveContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveContentSpecialist);
      });
    });
  });

  describe("Action: READ ActiveContentSpecialists", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveContentSpecialists", async () => {
        prismaMock.activeContentSpecialist.findMany.mockRejectedValueOnce(null);

        expect(
          readActiveContentSpecialists({ skip: 0, take: 10 })
        ).rejects.toThrow("Failed to find ActiveContentSpecialists");
      });
      test("Scenario: Failed to count ActiveContentSpecialists", async () => {
        prismaMock.activeContentSpecialist.findMany.mockResolvedValueOnce([
          MockActiveContentSpecialist,
        ]);
        prismaMock.activeContentSpecialist.count.mockRejectedValueOnce(null);

        expect(
          readActiveContentSpecialists({ skip: 0, take: 10 })
        ).rejects.toThrow("Failed to count ActiveContentSpecialists");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeContentSpecialist.findMany.mockResolvedValueOnce([
          MockActiveContentSpecialist,
        ]);
        prismaMock.activeContentSpecialist.count.mockResolvedValueOnce(1);

        expect(
          readActiveContentSpecialists({ skip: 0, take: 10 })
        ).resolves.toEqual({
          count: 1,
          activeContentSpecialists: [MockActiveContentSpecialist],
        });
      });
    });
  });

  describe("Action: READ ActiveContentSpecialistByUser", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveContentSpecialist for this User", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockRejectedValueOnce(
          null
        );

        expect(
          readActiveContentSpecialistByUser({ user: MockNonAdminUser })
        ).rejects.toThrow(
          "Failed to find ActiveContentSpecialist for this User"
        );
      });
      test("Scenario: ActiveContentSpecialist not found for this User", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockResolvedValueOnce(
          null
        );

        expect(
          readActiveContentSpecialistByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("ActiveContentSpecialist not found for this User");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockResolvedValueOnce(
          MockActiveContentSpecialist
        );

        expect(
          readActiveContentSpecialistByUser({ user: MockNonAdminUser })
        ).resolves.toEqual(MockActiveContentSpecialist);
      });
    });
  });

  describe("Action: READ ActiveContentSpecialist by ContentSpecialist", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveContentSpecialist for this ContentSpecialist", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockRejectedValueOnce(
          null
        );

        expect(
          readActiveContentSpecialistByContentSpecialist({
            id: MockContentSpecialist.id,
          })
        ).rejects.toThrow(
          "Failed to find ActiveContentSpecialist for this ContentSpecialist"
        );
      });
      test("Scenario: ActiveContentSpecialist not found for this ContentSpecialist", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockResolvedValueOnce(
          null
        );

        expect(
          readActiveContentSpecialistByContentSpecialist({
            id: MockContentSpecialist.id,
          })
        ).rejects.toThrow(
          "ActiveContentSpecialist not found for this ContentSpecialist"
        );
      });
      test("Scenario: Success", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockResolvedValueOnce(
          MockActiveContentSpecialist
        );

        expect(
          readActiveContentSpecialistByContentSpecialist({
            id: MockContentSpecialist.id,
          })
        ).resolves.toEqual(MockActiveContentSpecialist);
      });
    });
  });

  describe("Action: READ ActiveContentSpecialist", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveContentSpecialist not found", async () => {
        prismaMock.activeContentSpecialist.findUniqueOrThrow.mockRejectedValueOnce(
          null
        );

        expect(
          readActiveContentSpecialist({
            id: MockContentSpecialist.id,
          })
        ).rejects.toThrow("ActiveContentSpecialist not found");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeContentSpecialist.findUniqueOrThrow.mockResolvedValueOnce(
          MockActiveContentSpecialist
        );

        expect(
          readActiveContentSpecialist({
            id: MockContentSpecialist.id,
          })
        ).resolves.toEqual(MockActiveContentSpecialist);
      });
    });
  });

  describe("Action: DELETE ActiveContentSpecialist", () => {
    test("Role: User", async () => {
      expect(
        deleteActiveContentSpecialist({
          id: MockActiveContentSpecialist.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow(
        "You are not allowed to remove an active content specialist"
      );
    });
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete ActiveContentSpecialist", async () => {
        prismaMock.activeContentSpecialist.delete.mockRejectedValueOnce(null);

        expect(
          deleteActiveContentSpecialist({
            id: MockActiveContentSpecialist.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to delete ActiveContentSpecialist");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeContentSpecialist.delete.mockResolvedValueOnce(
          MockActiveContentSpecialist
        );

        expect(
          deleteActiveContentSpecialist({
            id: MockActiveContentSpecialist.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveContentSpecialist);
      });
    });
  });
});
