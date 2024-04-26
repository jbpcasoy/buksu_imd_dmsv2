import { prismaMock } from "@/prisma/singleton";
import {
  createActiveFaculty,
  deleteActiveFaculty,
  readActiveFaculties,
  readActiveFaculty,
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
        prismaMock.activeFaculty.create.mockResolvedValueOnce(
          MockActiveFaculty
        );

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
        prismaMock.activeFaculty.create.mockResolvedValueOnce(
          MockActiveFaculty
        );

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
    });

    test("Role: User", async () => {
      prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
      prismaMock.activeFaculty.count.mockResolvedValueOnce(0);
      prismaMock.activeFaculty.create.mockResolvedValueOnce(MockActiveFaculty);

      expect(
        createActiveFaculty({
          facultyId: MockFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to set an active faculty");
    });
  });

  describe("Action: READ ActiveFaculties", () => {
    test("Role: User", async () => {
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

  describe("Action: READ ActiveFaculty", () => {
    test("Role: User", async () => {
      prismaMock.activeFaculty.findUnique.mockResolvedValueOnce(
        MockActiveFaculty
      );

      expect(readActiveFaculty({ id: MockActiveFaculty.id })).resolves.toEqual(
        MockActiveFaculty
      );
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

      test("Scenario: Faculty is an Active Dean", async () => {
        prismaMock.activeDean.findFirst.mockResolvedValueOnce(MockActiveDean);

        expect(
          deleteActiveFaculty({ id: MockActiveFaculty.id, user: MockAdminUser })
        ).rejects.toThrow("Cannot deactivate, please remove dean role first");
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
