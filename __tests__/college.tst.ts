import { prismaMock } from "@/prisma/singleton";
import {
  createCollege,
  deleteCollege,
  readCollege,
  readColleges,
  updateCollege,
} from "@/services/collegeService";
import {
  MockAdminUser,
  MockCollege,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: College", () => {
  describe("Action: CREATE College", () => {
    describe("Role: Admin", () => {
      test("Scenario: Unique Name", async () => {
        prismaMock.college.create.mockResolvedValueOnce(MockCollege);

        await expect(
          createCollege({ user: MockAdminUser, name: "College of Technology" })
        ).resolves.toEqual(MockCollege);
      });

      test("Scenario: Duplicate Name", async () => {
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);

        await expect(
          createCollege({ user: MockAdminUser, name: "College of Technology" })
        ).rejects.toThrow("College name is already used");
      });

      test("Scenario: Failed to create college", async () => {
        prismaMock.college.create.mockRejectedValueOnce(null);

        await expect(
          createCollege({ user: MockAdminUser, name: "College of Technology" })
        ).rejects.toThrow("Failed to create college");
      });
    });

    test("Role: User", async () => {
      await expect(
        createCollege({ user: MockNonAdminUser, name: "College of Technology" })
      ).rejects.toThrow("You are not allowed to create a college");
    });
  });

  describe("Action: READ Colleges", () => {
    test("Role: User", async () => {
      prismaMock.college.findMany.mockResolvedValueOnce([MockCollege]);
      prismaMock.college.count.mockResolvedValueOnce(1);

      await expect(readColleges({ skip: 0, take: 10 })).resolves.toEqual({
        colleges: [MockCollege],
        count: 1,
      });
    });
  });

  describe("Action: READ College", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find college", async () => {
        prismaMock.college.findUnique.mockRejectedValueOnce(null);

        await expect(readCollege({ id: MockCollege.id })).rejects.toThrow(
          "Failed to find college"
        );
      });

      test("Scenario: Success", async () => {
        prismaMock.college.findUnique.mockResolvedValueOnce(MockCollege);

        await expect(readCollege({ id: MockCollege.id })).resolves.toEqual(
          MockCollege
        );
      });
    });
  });

  describe("Action: UPDATE College", () => {
    describe("Role: Admin", () => {
      test("Scenario: Unique Name", async () => {
        prismaMock.college.update.mockResolvedValueOnce(MockCollege);

        await expect(
          updateCollege({
            user: MockAdminUser,
            id: MockCollege.id,
            name: "College of Technology",
          })
        ).resolves.toEqual(MockCollege);
      });

      test("Scenario: Duplicate Name", async () => {
        prismaMock.college.findFirst.mockResolvedValueOnce(MockCollege);

        await expect(
          updateCollege({
            user: MockAdminUser,
            id: MockCollege.id,
            name: "College of Technology",
          })
        ).rejects.toThrow("College name is already used");
      });

      test("Scenario: Failed to find existing College", async () => {
        prismaMock.college.findFirst.mockRejectedValueOnce(null);

        await expect(
          updateCollege({
            user: MockAdminUser,
            id: MockCollege.id,
            name: "College of Technology",
          })
        ).rejects.toThrow("Failed to find existing College");
      });

      test("Scenario: Failed to update", async () => {
        prismaMock.college.update.mockRejectedValueOnce(null);

        await expect(
          updateCollege({
            user: MockAdminUser,
            id: MockCollege.id,
            name: "College of Technology",
          })
        ).rejects.toThrow("Failed to update college");
      });
    });

    test("Role: User", async () => {
      await expect(
        updateCollege({
          user: MockNonAdminUser,
          id: MockCollege.id,
          name: "College of Technology",
        })
      ).rejects.toThrow("You are not allowed to update this college");
    });
  });

  describe("Action: DELETE College", () => {
    describe("Action: DELETE College", () => {
      test("Scenario: Failed to delete college", async () => {
        prismaMock.college.delete.mockRejectedValueOnce(null);

        await expect(
          deleteCollege({ user: MockAdminUser, id: MockCollege.id })
        ).rejects.toThrow("Failed to delete college");
      });

      test("Scenario: Success", async () => {
        prismaMock.college.delete.mockResolvedValueOnce(MockCollege);

        await expect(
          deleteCollege({ user: MockAdminUser, id: MockCollege.id })
        ).resolves.toEqual(MockCollege);
      });
    });

    test("Role: User", async () => {
      await expect(
        deleteCollege({ user: MockNonAdminUser, id: MockCollege.id })
      ).rejects.toThrow("You are not allowed to delete this college");
    });
  });
});
