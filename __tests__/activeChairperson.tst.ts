import { prismaMock } from "@/prisma/singleton";
import {
  createActiveChairperson,
  deleteActiveChairperson,
  readActiveChairperson,
  readActiveChairpersonByChairperson,
  readActiveChairpersonByUser,
  readActiveChairpersons,
} from "@/services/activeChairpersonService";
import {
  MockActiveChairperson,
  MockActiveFaculty,
  MockAdminUser,
  MockChairperson,
  MockDepartment,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ActiveChairperson", () => {
  describe("Action: CREATE ActiveChairperson", () => {
    describe("Role: Admin", () => {
      test("Scenario: Failed to  find Chairperson", async () => {
        prismaMock.chairperson.findFirst.mockRejectedValueOnce(null);
        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Chairperson");
      });

      test("Scenario: Chairperson not found", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(null);
        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Chairperson not found");
      });

      test("Scenario: Failed to count ActiveChairperson for this User", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockRejectedValueOnce(null);

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to count ActiveChairpersons for this User");
      });
      test("Scenario: Faculty can only be an ActiveChairperson on one Department", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(1);

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Faculty can only be an ActiveChairperson on one Department"
        );
      });
      test("Scenario: Failed to find Department", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Department");
      });
      test("Scenario: Department not found", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Department not found");
      });

      test("Scenario: Failed to count ActiveChairpersons for this department", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeChairperson.count.mockRejectedValueOnce(null);

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow(
          "Failed to count ActiveChairpersons for this department"
        );
      });

      test("Scenario: Department can only have one active chairperson", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(1);

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Department can only have one active chairperson");
      });

      test("Scenario: Failed to create ActiveChairperson", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.activeChairperson.create.mockRejectedValueOnce(null);

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create ActiveChairperson");
      });

      test("Scenario: Success", async () => {
        prismaMock.chairperson.findFirst.mockResolvedValueOnce(MockChairperson);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.department.findFirst.mockResolvedValueOnce(MockDepartment);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(0);
        prismaMock.activeChairperson.create.mockResolvedValueOnce(
          MockActiveChairperson
        );

        expect(
          createActiveChairperson({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveChairperson);
      });
    });

    test("Role: User", async () => {
      expect(
        createActiveChairperson({
          activeFacultyId: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to set an active chairperson");
    });
  });

  describe("Action: READ ActiveChairpersons", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveChairpersons", async () => {
        prismaMock.activeChairperson.findMany.mockRejectedValueOnce(null);

        expect(readActiveChairpersons({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find ActiveChairpersons"
        );
      });

      test("Scenario: Failed to count ActiveChairpersons", async () => {
        prismaMock.activeChairperson.findMany.mockResolvedValueOnce([
          MockActiveChairperson,
        ]);
        prismaMock.activeChairperson.count.mockRejectedValueOnce(null);

        expect(readActiveChairpersons({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count ActiveChairpersons"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.activeChairperson.findMany.mockResolvedValueOnce([
          MockActiveChairperson,
        ]);
        prismaMock.activeChairperson.count.mockResolvedValueOnce(1);

        expect(readActiveChairpersons({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          activeChairpersons: [MockActiveChairperson],
        });
      });
    });
  });

  //   TODO change all findUnique into findUniqueOrThrow
  describe("Action: READ ActiveChairperson", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveChairperson not found", async () => {
        prismaMock.activeChairperson.findUniqueOrThrow.mockRejectedValueOnce(
          null
        );

        expect(
          readActiveChairperson({ id: MockActiveChairperson.id })
        ).rejects.toThrow("ActiveChairperson not found");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeChairperson.findUniqueOrThrow.mockResolvedValueOnce(
          MockActiveChairperson
        );

        expect(
          readActiveChairperson({ id: MockActiveChairperson.id })
        ).resolves.toEqual(MockActiveChairperson);
      });
    });
  });

  describe("Action: READ ActiveChairperson by Chairperson", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveChairperson for this Chairperson", async () => {
        prismaMock.activeChairperson.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveChairpersonByChairperson({ id: MockChairperson.id })
        ).rejects.toThrow(
          "Failed to find ActiveChairperson for this Chairperson"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.activeChairperson.findFirst.mockResolvedValueOnce(
          MockActiveChairperson
        );
        expect(
          readActiveChairpersonByChairperson({ id: MockChairperson.id })
        ).resolves.toEqual(MockActiveChairperson);
      });
    });
  });

  describe("Action: READ ActiveChairpersonByUser", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveChairperson for this User", async () => {
        prismaMock.activeChairperson.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveChairpersonByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("Failed to find ActiveChairperson for this User");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeChairperson.findFirst.mockResolvedValueOnce(
          MockActiveChairperson
        );

        expect(
          readActiveChairpersonByUser({ user: MockNonAdminUser })
        ).resolves.toEqual(MockActiveChairperson);
      });
    });
  });

  describe("Action: DELETE ActiveChairperson", () => {
    test("Role: User", async () => {
      expect(
        deleteActiveChairperson({
          id: MockActiveChairperson.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to remove an active chairperson");
    });
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete ActiveChairperson", async () => {
        prismaMock.activeChairperson.delete.mockRejectedValueOnce(null);

        expect(
          deleteActiveChairperson({
            id: MockActiveChairperson.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to delete ActiveChairperson");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeChairperson.delete.mockResolvedValueOnce(
          MockActiveChairperson
        );

        expect(
          deleteActiveChairperson({
            id: MockActiveChairperson.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveChairperson);
      });
    });
  });
});
