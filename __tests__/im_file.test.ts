import { AppAbility } from "@/services/ability/abilityBuilder";
import iMFileAbility from "@/services/ability/iMFileAbility";
import { Faculty, IM, User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("IMFile Permissions", () => {
  let ability: AppAbility;

  const adminUser: User = {
    email: null,
    emailVerified: null,
    id: "2b20871f-d8f3-5c87-bb98-32b8997f241a",
    image: null,
    isAdmin: true,
    name: null,
  };

  const nonAdminUser: User = {
    email: null,
    emailVerified: null,
    id: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
    image: null,
    isAdmin: false,
    name: null,
  };

  const nonAdminFaculty: Faculty = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "f04cb29d-2282-5dad-8bde-2c109cee9f81",
    departmentId: "0f5a97aa-fbd7-5f63-9177-21343086df2b",
    userId: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
  };

  const iM: IM = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "1b212a10-4e34-593e-96d9-41ec7a4337af",
    facultyId: "f04cb29d-2282-5dad-8bde-2c109cee9f81",
    title: "Test IM Title",
    type: "MODULE",
  };

  const nonIMOwnerFaculty = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "c48efd2e-4ced-57c7-b5c0-fb3f9999c41e",
    departmentId: "0f5a97aa-fbd7-5f63-9177-21343086df2b",
    userId: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
  };

  describe("when user is an admin", () => {
    beforeEach(() => {
      ability = iMFileAbility({ user: adminUser });
    });

    it("can create iMFile", () => {
      expect(ability.can("create", "IMFile")).toBe(true);
    });
    it("can read iMFile", () => {
      expect(ability.can("read", "IMFile")).toBe(true);
    });
    it("can't update iMFile", () => {
      expect(ability.can("update", "IMFile")).toBe(false);
    });
    it("can delete iMFile", () => {
      expect(ability.can("delete", "IMFile")).toBe(true);
    });
  });

  describe("when user is not an admin", () => {
    describe("when user is IM owner", () => {
      beforeEach(() => {
        ability = iMFileAbility({
          user: nonAdminUser,
          userFaculty: nonAdminFaculty,
          iM,
        });
      });

      it("can create iMFile", () => {
        expect(ability.can("create", "IMFile")).toBe(true);
      });
      it("can read iMFile", () => {
        expect(ability.can("read", "IMFile")).toBe(true);
      });
      it("can't update iMFile", () => {
        expect(ability.can("update", "IMFile")).toBe(false);
      });
      it("can delete iMFile", () => {
        expect(ability.can("delete", "IMFile")).toBe(true);
      });
    });

    describe("when user is not IM owner", () => {
      beforeEach(() => {
        ability = iMFileAbility({
          user: nonAdminUser,
          userFaculty: nonIMOwnerFaculty,
          iM,
        });
      });

      it("can't create iMFile", () => {
        expect(ability.can("create", "IMFile")).toBe(false);
      });
      it("can't read iMFile", () => {
        expect(ability.can("read", "IMFile")).toBe(false);
      });
      it("can't update iMFile", () => {
        expect(ability.can("update", "IMFile")).toBe(false);
      });
      it("can't delete iMFile", () => {
        expect(ability.can("delete", "IMFile")).toBe(false);
      });
    });
  });
});
