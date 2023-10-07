import { AppAbility } from "@/services/ability/abilityBuilder";
import iMAbility from "@/services/ability/iMAbility";
import { subject } from "@casl/ability";
import { Faculty, IM, User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("IM Permissions", () => {
  let ability: AppAbility;
  let user: User;
  let userFaculty: Faculty | null;
  let iMFaculty: Faculty | null;

  const adminUser: User = {
    email: null,
    emailVerified: null,
    id: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
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

  const nonOwnerFaculty = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "c48efd2e-4ced-57c7-b5c0-fb3f9999c41e",
    departmentId: "0f5a97aa-fbd7-5f63-9177-21343086df2b",
    userId: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
  };

  describe("when user is an admin", () => {
    beforeEach(() => {
      ability = iMAbility({ user: adminUser });
    });

    it("can create iM", () => {
      expect(ability.can("create", "IM")).toBe(true);
    });
    it("can read iM", () => {
      expect(ability.can("read", "IM")).toBe(true);
    });
    it("can update iM", () => {
      expect(ability.can("update", "IM")).toBe(true);
    });
    it("can delete iM", () => {
      expect(ability.can("delete", "IM")).toBe(true);
    });
  });

  describe("when user is not an admin", () => {
    beforeEach(() => {
      ability = iMAbility({ user: nonAdminUser, userFaculty: nonAdminFaculty });
    });

    it("can create iM", () => {
      expect(ability.can("create", "IM")).toBe(true);
    });

    describe("when user is not the IM owner", () => {
      beforeEach(() => {
        ability = iMAbility({
          user: nonAdminUser,
          userFaculty: nonOwnerFaculty,
          iM
        });
      });

      it("can read iM", () => {
        expect(ability.can("read", subject("IM", iM))).toBe(false);
      });
      it("can update iM", () => {
        expect(ability.can("update", "IM")).toBe(false);
      });
      it("can delete iM", () => {
        expect(ability.can("delete", "IM")).toBe(false);
      });
    });

    describe("when user is the IM owner", () => {
      beforeEach(() => {
        ability = iMAbility({
          user: nonAdminUser,
          userFaculty: nonAdminFaculty,
          iM
        });
      });

      it("can read iM", () => {
        expect(ability.can("read", subject("IM", iM))).toBe(true);
      });
      it("can update iM", () => {
        expect(ability.can("update", "IM")).toBe(true);
      });
      it("can delete iM", () => {
        expect(ability.can("delete", "IM")).toBe(true);
      });
    });
  });
});
