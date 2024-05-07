import { prismaMock } from "@/prisma/singleton";
import {
  createActiveDean,
  deleteActiveDean,
  readActiveDean,
  readActiveDeanByDean,
  readActiveDeanByUser,
  readActiveDeans,
} from "@/services/activeDeanService";
import {
  MockActiveDean,
  MockActiveFaculty,
  MockAdminUser,
  MockCollege,
  MockDean,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ActiveDean", () => {
  describe("Action: CREATE ActiveDean", () => {
    test("Role: User", () => {
      expect(
        createActiveDean({
          activeFacultyId: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to set an active dean");
    });
    describe("Role: Admin", () => {
      test("Scenario: Failed to find Dean", async () => {
        prismaMock.dean.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Dean");
      });
      test("Scenario: Dean not found", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Dean not found");
      });

      test("Scenario: Failed to count ActiveDeans for this User", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockRejectedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to count ActiveDeans for this User");
      });
      test("Scenario: Faculty can only be an active dean on one college", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockResolvedValueOnce(1);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Faculty can only be an active dean on one college");
      });

      test("Scenario: Failed to find College", () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.college.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find College");
      });
      test("Scenario: College not found", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.college.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("College not found");
      });

      test("Scenario: Failed to count ActiveDeans for this College", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.activeDean.count.mockRejectedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to count ActiveDeans for this College");
      });
      test("Scenario: College can only have one active dean", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.activeDean.count.mockResolvedValueOnce(1);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("College can only have one active dean");
      });

      test("Scenario: Failed to create ActiveDean", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.activeDean.create.mockRejectedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create ActiveDean");
      });
      test("Scenario: Success", async () => {
        prismaMock.dean.findFirst.mockResolvedValueOnce(MockDean);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);
        prismaMock.activeDean.count.mockResolvedValueOnce(0);
        prismaMock.activeDean.create.mockResolvedValueOnce(MockActiveDean);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveDean.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveDean);
      });
    });
  });

  describe("Action: READ ActiveDeans", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveDeans", async () => {
        prismaMock.activeDean.findMany.mockRejectedValueOnce(null);

        expect(readActiveDeans({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find ActiveDeans"
        );
      });

      test("Scenario: Failed to count ActiveDeans", async () => {
        prismaMock.activeDean.findMany.mockResolvedValue([MockActiveDean]);
        prismaMock.activeDean.count.mockRejectedValueOnce(null);

        expect(
          createActiveDean({
            activeFacultyId: MockActiveDean.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Dean not found");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeDean.findMany.mockResolvedValue([MockActiveDean]);
        prismaMock.activeDean.count.mockResolvedValueOnce(1);

        expect(readActiveDeans({ skip: 0, take: 10 })).resolves.toEqual({
          count: 1,
          activeDeans: [MockActiveDean],
        });
      });
    });
  });

  describe("Action: READ ActiveDean by User", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveDean for this User", async () => {
        prismaMock.activeDean.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveDeanByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("Failed to find ActiveDean for this User");
      });

      test("Scenario: ActiveDean not found for this User", async () => {
        prismaMock.activeDean.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveDeanByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("ActiveDean not found for this User");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeDean.findFirst.mockResolvedValueOnce(MockActiveDean);

        expect(
          readActiveDeanByUser({ user: MockNonAdminUser })
        ).resolves.toEqual(MockActiveDean);
      });
    });
  });

  describe("Action: READ ActiveDean by Dean", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveDean for this Dean", async () => {
        prismaMock.activeDean.findFirst.mockRejectedValueOnce(null);

        expect(readActiveDeanByDean({ id: MockDean.id })).rejects.toThrow(
          "Failed to find ActiveDean for this Dean"
        );
      });

      test("Scenario: ActiveDean not found for this Dean", async () => {
        prismaMock.activeDean.findFirst.mockResolvedValue(null);

        expect(readActiveDeanByDean({ id: MockDean.id })).rejects.toThrow(
          "ActiveDean not found for this Dean"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.activeDean.findFirst.mockResolvedValueOnce(MockActiveDean);

        expect(readActiveDeanByDean({ id: MockDean.id })).resolves.toEqual(
          MockActiveDean
        );
      });
    });
  });

  describe("Action: READ ActiveDean", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveDean not found", async () => {
        prismaMock.activeDean.findUniqueOrThrow.mockRejectedValueOnce(null);

        expect(readActiveDean({ id: MockActiveDean.id })).rejects.toThrow(
          "ActiveDean not found"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.activeDean.findUniqueOrThrow.mockResolvedValueOnce(
          MockActiveDean
        );

        expect(readActiveDean({ id: MockActiveDean.id })).resolves.toEqual(
          MockActiveDean
        );
      });
    });
  });

  describe("Action: DELETE ActiveDean", () => {
    test("Role: User", async () => {
      expect(
        deleteActiveDean({ id: MockActiveDean.id, user: MockNonAdminUser })
      ).rejects.toThrow("You are not allowed to remove an active dean");
    });
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete ActiveDean", async () => {
        prismaMock.activeDean.delete.mockRejectedValueOnce(null);

        expect(
          deleteActiveDean({ id: MockActiveDean.id, user: MockAdminUser })
        ).rejects.toThrow("Failed to delete ActiveDean");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeDean.delete.mockResolvedValueOnce(MockActiveDean);

        expect(
          deleteActiveDean({ id: MockActiveDean.id, user: MockAdminUser })
        ).resolves.toEqual(MockActiveDean);
      });
    });
  });
});
