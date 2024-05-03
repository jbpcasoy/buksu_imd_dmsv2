import { prismaMock } from "@/prisma/singleton";
import {
  createContentSpecialist,
  deleteContentSpecialist,
  readContentSpecialist,
  readContentSpecialists,
} from "@/services/contestSpecialistService";
import {
  MockActiveFaculty,
  MockAdminUser,
  MockContentSpecialist,
  MockFaculty,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ContentSpecialist", () => {
  describe("Action: CREATE ContentSpecialist", () => {
    test("Role: User", async () => {
      expect(
        createContentSpecialist({
          activeFacultyId: MockActiveFaculty.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to create a content specialist");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to find existing Content Specialist", async () => {
        prismaMock.contentSpecialist.findFirst.mockRejectedValueOnce(null);

        expect(
          createContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find existing ContentSpecialist");
      });
      test("Scenario: Content specialist already exists", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(
          MockContentSpecialist
        );

        expect(
          createContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Content specialist already exists");
      });

      test("Scenario: Failed to find Faculty", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(null);
        prismaMock.faculty.findFirst.mockRejectedValueOnce(null);

        expect(
          createContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find Faculty");
      });
      test("Scenario: Faculty not found", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(null);
        prismaMock.faculty.findFirst.mockResolvedValueOnce(null);

        expect(
          createContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Faculty not found");
      });

      test("Scenario: Failed to create ContentSpecialist", async () => {
        prismaMock.contentSpecialist.findFirst.mockResolvedValueOnce(null);
        prismaMock.faculty.findFirst.mockResolvedValueOnce(MockFaculty);
        prismaMock.contentSpecialist.create.mockRejectedValueOnce(null);

        expect(
          createContentSpecialist({
            activeFacultyId: MockActiveFaculty.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create ContentSpecialist");
      });
    });
  });

  describe("Action: READ ContentSpecialists", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ContentSpecialists", async () => {
        prismaMock.contentSpecialist.findMany.mockRejectedValueOnce(null);

        expect(
          readContentSpecialists({
            skip: 0,
            take: 10,
          })
        ).rejects.toThrow("Failed to find ContentSpecialists");
      });
      test("Scenario: Failed to count ContentSpecialist", async () => {
        prismaMock.contentSpecialist.findMany.mockResolvedValueOnce([
          MockContentSpecialist,
        ]);
        prismaMock.contentSpecialist.count.mockRejectedValueOnce(null);

        expect(
          readContentSpecialists({
            skip: 0,
            take: 10,
          })
        ).rejects.toThrow("Failed to count ContentSpecialists");
      });
      test("Scenario: Success", async () => {
        prismaMock.contentSpecialist.findMany.mockResolvedValueOnce([
          MockContentSpecialist,
        ]);
        prismaMock.contentSpecialist.count.mockResolvedValueOnce(1);

        expect(
          readContentSpecialists({
            skip: 0,
            take: 10,
          })
        ).resolves.toEqual({
          count: 1,
          contentSpecialists: [MockContentSpecialist],
        });
      });
    });
  });

  describe("Action: READ ContentSpecialist", () => {
    describe("Role: User", () => {
      test("Scenario: ContentSpecialist not found", async () => {
        prismaMock.contentSpecialist.findUniqueOrThrow.mockRejectedValueOnce(
          null
        );

        expect(
          readContentSpecialist({
            id: MockContentSpecialist.id,
          })
        ).rejects.toThrow("ContentSpecialist not found");
      });

      test("Scenario: Success", async () => {
        prismaMock.contentSpecialist.findUniqueOrThrow.mockResolvedValueOnce(
          MockContentSpecialist
        );

        expect(
          readContentSpecialist({
            id: MockContentSpecialist.id,
          })
        ).resolves.toEqual(MockContentSpecialist);
      });
    });
  });

  describe("Action: DELETE ContentSpecialist", () => {
    test("Role: User", async () => {
      expect(
        deleteContentSpecialist({
          id: MockContentSpecialist.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow(
        "You are not allowed to delete this content specialist"
      );
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to delete ContentSpecialist", async () => {
        prismaMock.contentSpecialist.delete.mockRejectedValueOnce(null);

        expect(
          deleteContentSpecialist({
            id: MockContentSpecialist.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to delete ContentSpecialist");
      });
      test("Scenario: Success", async () => {
        prismaMock.contentSpecialist.delete.mockResolvedValueOnce(
          MockContentSpecialist
        );

        expect(
          deleteContentSpecialist({
            id: MockContentSpecialist.facultyId,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockContentSpecialist);
      });
    });
  });
});
