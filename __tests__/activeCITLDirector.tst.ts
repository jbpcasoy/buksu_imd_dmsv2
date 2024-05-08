import { prismaMock } from "@/prisma/singleton";
import {
  createActiveCITLDirector,
  deleteActiveCITLDirector,
  readActiveCITLDirector,
  readActiveCITLDirectorByCITLDirector,
  readActiveCITLDirectorByUser,
  readActiveCITLDirectors,
} from "@/services/activeCITLDirectorService";
import {
  MockActiveCITLDirector,
  MockAdminUser,
  MockCITLDirector,
  MockNonAdminUser,
} from "@/services/mockData";

describe("Model: ActiveCITLDirector", () => {
  describe("Action: CREATE ActiveCITLDirector", () => {
    test("Role: User", async () => {
      expect(
        createActiveCITLDirector({
          cITLDirectorId: MockCITLDirector.id,
          user: MockNonAdminUser,
        })
      ).rejects.toThrow("You are not allowed to set an active CITL director");
    });

    describe("Role: Admin", () => {
      test("Scenario: Failed to find CITLDirector", async () => {
        prismaMock.cITLDirector.findFirst.mockRejectedValueOnce(null);

        expect(
          createActiveCITLDirector({
            cITLDirectorId: MockCITLDirector.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to find CITLDirector");
      });
      test("Scenario: CITLDirector not found", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(null);

        expect(
          createActiveCITLDirector({
            cITLDirectorId: MockCITLDirector.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("CITLDirector not found");
      });

      test("Scenario: Failed to count activeCITLDirector for this CITLDirector", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(
          MockCITLDirector
        );
        prismaMock.activeCITLDirector.count.mockRejectedValueOnce(null);

        expect(
          createActiveCITLDirector({
            cITLDirectorId: MockCITLDirector.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to count activeCITLDirector");
      });
      test("Scenario: There can only be one active CITL Director", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(
          MockCITLDirector
        );
        prismaMock.activeCITLDirector.count.mockResolvedValueOnce(1);

        expect(
          createActiveCITLDirector({
            cITLDirectorId: MockCITLDirector.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("There can only be one active CITL Director");
      });
      test("Scenario: Failed to create ActiveCITLDirector", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(
          MockCITLDirector
        );
        prismaMock.activeCITLDirector.count.mockResolvedValueOnce(0);
        prismaMock.activeCITLDirector.create.mockRejectedValueOnce(null);

        expect(
          createActiveCITLDirector({
            cITLDirectorId: MockCITLDirector.id,
            user: MockAdminUser,
          })
        ).rejects.toThrow("Failed to create ActiveCITLDirector");
      });
      test("Scenario: Success", async () => {
        prismaMock.cITLDirector.findFirst.mockResolvedValueOnce(
          MockCITLDirector
        );
        prismaMock.activeCITLDirector.count.mockResolvedValueOnce(0);
        prismaMock.activeCITLDirector.create.mockResolvedValueOnce(
          MockActiveCITLDirector
        );

        expect(
          createActiveCITLDirector({
            cITLDirectorId: MockCITLDirector.id,
            user: MockAdminUser,
          })
        ).resolves.toEqual(MockActiveCITLDirector);
      });
    });
  });

  describe("Action: READ ActiveCITLDirectors", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveCITLDirectors", async () => {
        prismaMock.activeCITLDirector.findMany.mockRejectedValueOnce(null);

        expect(readActiveCITLDirectors({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to find ActiveCITLDirectors"
        );
      });
      test("Scenario: Failed to count ActiveCITLDirectors", async () => {
        prismaMock.activeCITLDirector.findMany.mockResolvedValueOnce([
          MockActiveCITLDirector,
        ]);
        prismaMock.activeCITLDirector.count.mockRejectedValueOnce(null);

        expect(readActiveCITLDirectors({ skip: 0, take: 10 })).rejects.toThrow(
          "Failed to count ActiveCITLDirectors"
        );
      });
      test("Scenario: Success", async () => {
        prismaMock.activeCITLDirector.findMany.mockResolvedValueOnce([
          MockActiveCITLDirector,
        ]);
        prismaMock.activeCITLDirector.count.mockResolvedValueOnce(1);

        expect(readActiveCITLDirectors({ skip: 0, take: 1 })).resolves.toEqual({
          count: 1,
          activeCITLDirectors: [MockActiveCITLDirector],
        });
      });
    });
  });

  describe("Action: READ ActiveCITLDirector by User", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveCITLDirector for this User", async () => {
        prismaMock.activeCITLDirector.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveCITLDirectorByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("Failed to find ActiveCITLDirector for this User");
      });
      test("Scenario: ActiveCITLDirector not found for this User", async () => {
        prismaMock.activeCITLDirector.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveCITLDirectorByUser({ user: MockNonAdminUser })
        ).rejects.toThrow("ActiveCITLDirector not found for this User");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeCITLDirector.findFirst.mockResolvedValueOnce(
          MockActiveCITLDirector
        );

        expect(
          readActiveCITLDirectorByUser({ user: MockNonAdminUser })
        ).resolves.toEqual(MockActiveCITLDirector);
      });
    });
  });

  describe("Action: READ ActiveCITLDirector by CITLDirector", () => {
    describe("Role: User", () => {
      test("Scenario: Failed to find ActiveCITLDirector for this CITLDirector", async () => {
        prismaMock.activeCITLDirector.findFirst.mockRejectedValueOnce(null);

        expect(
          readActiveCITLDirectorByCITLDirector({ id: MockCITLDirector.id })
        ).rejects.toThrow(
          "Failed to find ActiveCITLDirector for this CITLDirector"
        );
      });
      test("Scenario: ActiveCITLDirector not found for this CITLDirector", async () => {
        prismaMock.activeCITLDirector.findFirst.mockResolvedValueOnce(null);

        expect(
          readActiveCITLDirectorByCITLDirector({ id: MockCITLDirector.id })
        ).rejects.toThrow("ActiveCITLDirector not found for this CITLDirector");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeCITLDirector.findFirst.mockResolvedValueOnce(
          MockActiveCITLDirector
        );

        expect(
          readActiveCITLDirectorByCITLDirector({ id: MockCITLDirector.id })
        ).resolves.toEqual(MockActiveCITLDirector);
      });
    });
  });

  describe("Action: READ ActiveCITLDirector", () => {
    describe("Role: User", () => {
      test("Scenario: ActiveCITLDirector not found", async () => {
        prismaMock.activeCITLDirector.findUniqueOrThrow.mockRejectedValue(null);

        expect(
          readActiveCITLDirector({ id: MockActiveCITLDirector.id })
        ).rejects.toThrow("ActiveCITLDirector not found");
      });
      test("Scenario: Success", async () => {
        prismaMock.activeCITLDirector.findUniqueOrThrow.mockResolvedValueOnce(
          MockActiveCITLDirector
        );

        expect(
          readActiveCITLDirector({ id: MockActiveCITLDirector.id })
        ).resolves.toEqual(MockActiveCITLDirector);
      });
    });
  });

  describe("Action: DELETE ActiveCITLDirector", () => {
    test("Role: User", async () => {
      expect(
        deleteActiveCITLDirector({
          user: MockNonAdminUser,
          id: MockActiveCITLDirector.id,
        })
      ).rejects.toThrow(
        "You are not allowed to remove an active CITL director"
      );
    });
    describe("Role: Admin", () => {
      test("Scenario: Failed to delete ActiveCITLDirector", async () => {
        prismaMock.activeCITLDirector.delete.mockRejectedValueOnce(null);

        expect(
          deleteActiveCITLDirector({
            user: MockAdminUser,
            id: MockActiveCITLDirector.id,
          })
        ).rejects.toThrow("Failed to delete ActiveCITLDirector");
      });

      test("Scenario: Success", async () => {
        prismaMock.activeCITLDirector.delete.mockResolvedValueOnce(
          MockActiveCITLDirector
        );

        expect(
          deleteActiveCITLDirector({
            user: MockAdminUser,
            id: MockActiveCITLDirector.id,
          })
        ).resolves.toEqual(MockActiveCITLDirector);
      });
    });
  });
});
