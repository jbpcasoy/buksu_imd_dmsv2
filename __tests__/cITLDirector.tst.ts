import { createCITLDirector } from "@/services/cITLDirectorService";
import { MockNonAdminUser } from "@/services/mockData";

describe("Model: CITLDirector", () => {
  describe("Action: CREATE CITLDirector", () => {
    test("Role: User", () => {
      expect(
        createCITLDirector({
          user: MockNonAdminUser,
          userId: MockNonAdminUser.id,
        })
      ).rejects.toThrow("Error");
    });
  });
});
