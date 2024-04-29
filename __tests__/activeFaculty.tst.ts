import { prismaMock } from "@/prisma/singleton";
import {
  createActiveFaculty,
  deleteActiveFaculty,
  readActiveFaculties,
  readActiveFaculty,
  readActiveFacultyByFaculty,
  readActiveFacultyMe,
} from "@/services/activeFacultyService";
import {
  MockActiveChairperson,
  MockActiveContentSpecialist,
  MockActiveCoordinator,
  MockActiveDean,
  MockActiveFaculty,
  MockAdminUser,
  MockFaculty,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ActiveFaculty", () => {
  describe("Action: CREATE ActiveFaculty", () => {
    describe("Role: Admin", () => {
      test("Scenario: Faculty not found", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveFaculty({
            facultyId: MockFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Faculty not found");
      });

      test("Scenario: Faculty is already active on another department", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.activeFaculty.count.mockResolvedValueOnce(1);

        expect(
          createActiveFaculty({
            facultyId: MockFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Faculty can only belong to one department");
      });

      test("Scenario: Faculty found and not yet active", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.activeFaculty.count.mockResolvedValueOnce(0);
        prismaMock.activeFaculty.create.mockResolvedValueOnce(
          MockActiveFaculty
        );

        expect(
          createActiveFaculty({
            facultyId: MockFaculty.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveFaculty);
      });

      test("Scenario: Faculty found and not yet active, creation failed", async () => {
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.activeFaculty.count.mockResolvedValueOnce(0);
        prismaMock.activeFaculty.create.mockRejectedValueOnce(null);

        expect(
          createActiveFaculty({
            facultyId: MockFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create ActiveFaculty");
      });
    });

    test("Role: User", async () => {
      expect(
        createActiveFaculty({
          facultyId: MockFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to set an active faculty");
    });
  });

  describe("Action: READ ActiveFaculties", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveFaculties", async () => {
        prismaMock.activeFaculty.findMany.mockRejectedValueOnce(null);

        expect(
          readActiveFaculties({
            skip: 0,
            take: 10,
            user: MockNonAdminUser,
          })
        ).rejects.toThrow("Failed to find ActiveFaculties");
      });

      test("Scenario: Failed to count ActiveFaculties", async () => {
        prismaMock.activeFaculty.findMany.mockResolvedValueOnce([
          MockActiveFaculty,
        ]);
        prismaMock.activeFaculty.count.mockRejectedValueOnce(null);

        expect(
          readActiveFaculties({
            skip: 0,
            take: 10,
            user: MockNonAdminUser,
          })
        ).rejects.toThrow("Failed to count ActiveFaculties");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeFaculty.findMany.mockResolvedValueOnce([
          MockActiveFaculty,
        ]);
        prismaMock.activeFaculty.count.mockResolvedValueOnce(1);

        expect(
          readActiveFaculties({
            skip: 0,
            take: 10,
            user: MockNonAdminUser,
          })
        ).resolves.toEqual({
          count: 1,
          activeFaculties: [MockActiveFaculty],
        });
      });
    });
  });

  describe("Action: READ ActiveFaculty", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveFaculty not found", async () => {
        prismaMock.activeFaculty.findUnique.mockResolvedValueOnce(null);

        expect(readActiveFaculty({ id: MockActiveFaculty.id })).rejects.toThrow(
          "ActiveFaculty not found"
        );
      });
      test("Scenario: ActiveFaculty found", async () => {
        prismaMock.activeFaculty.findUnique.mockResolvedValueOnce(
          MockActiveFaculty
        );

        expect(
          readActiveFaculty({ id: MockActiveFaculty.id })
        ).resolves.toEqual(MockActiveFaculty);
      });
    });
  });

  describe("Action: Read My ActiveFaculty", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveFaculty not found", async () => {
        prismaMock.activeFaculty.findFirst.mockResolvedValueOnce(null);

        expect(readActiveFacultyMe({ user: MockNonAdminUser })).rejects.toThrow(
          "ActiveFaculty not found"
        );
      });

      test("Scenario: ActiveFaculty found", async () => {
        prismaMock.activeFaculty.findFirst.mockResolvedValueOnce(
          MockActiveFaculty
        );

        expect(
          readActiveFacultyMe({ user: MockNonAdminUser })
        ).resolves.toEqual(MockActiveFaculty);
      });
    });
  });

  describe("Action: Read ActiveFaculty by Faculty", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveFaculty not found", () => {
        prismaMock.activeFaculty.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveFacultyByFaculty({ id: MockFaculty.id })
        ).rejects.toThrow("ActiveFaculty not found");
      });

      test("Scenario: ActiveFaculty found", () => {
        prismaMock.activeFaculty.findFirst.mockResolvedValueOnce(
          MockActiveFaculty
        );

        expect(
          readActiveFacultyByFaculty({ id: MockFaculty.id })
        ).resolves.toEqual(MockActiveFaculty);
      });
    });
  });

  describe("Action: DELETE ActiveFaculty", () => {
    describe("Role: Admin", () => {
      test("Scenario: Faculty is an Active Chairperson", async () => {
        prismaMock.activeChairperson.findFirst.mockResolvedValueOnce(
          MockActiveChairperson
        );

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow(
          "Cannot deactivate, please remove chairperson role first"
        );
      });

      test("Scenario: Failed to find ActiveChairperson", async () => {
        prismaMock.activeChairperson.findFirst.mockRejectedValueOnce(null);

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to find ActiveChairperson");
      });

      test("Scenario: Faculty is an Active Coordinator", async () => {
        prismaMock.activeCoordinator.findFirst.mockResolvedValueOnce(
          MockActiveCoordinator
        );

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow(
          "Cannot deactivate, please remove coordinator role first"
        );
      });

      test("Scenario: Failed to find ActiveCoordinator", async () => {
        prismaMock.activeCoordinator.findFirst.mockRejectedValueOnce(null);

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to find ActiveCoordinator");
      });

      test("Scenario: Failed to find ActiveDean", async () => {
        prismaMock.activeDean.findFirst.mockRejectedValueOnce(MockActiveDean);

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to find ActiveDean");
      });

      test("Scenario: Faculty is an Active Dean", async () => {
        prismaMock.activeDean.findFirst.mockResolvedValueOnce(MockActiveDean);

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow("Cannot deactivate, please remove dean role first");
      });

      test("Scenario: Failed to find ActiveContentSpecialist", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockRejectedValueOnce(
          null
        );

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to find ActiveContentSpecialist");
      });

      test("Scenario: Faculty is an Active Content Specialist", async () => {
        prismaMock.activeContentSpecialist.findFirst.mockResolvedValueOnce(
          MockActiveContentSpecialist
        );

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow(
          "Cannot deactivate, please remove content specialist role first"
        );
      });

      test("Scenario: Faculty has no other roles", async () => {
        prismaMock.activeFaculty.delete.mockResolvedValueOnce(
          MockActiveFaculty
        );

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).resolves.toEqual(MockActiveFaculty);
      });

      test("Scenario: Failed to delete ActiveFaculty", async () => {
        prismaMock.activeFaculty.delete.mockRejectedValueOnce(null);

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to delete ActiveFaculty");
      });
    });

    test("Role: User", async () => {
      prismaMock.activeFaculty.delete.mockResolvedValueOnce(MockActiveFaculty);

      expect(
        deleteActiveFaculty({
          id: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to remove this active faculty");
    });
  });
});
