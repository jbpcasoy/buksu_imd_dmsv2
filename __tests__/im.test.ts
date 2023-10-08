import { AppAbility } from "@/services/ability/abilityBuilder";
import iMAbility from "@/services/ability/iMAbility";
import { subject } from "@casl/ability";
import { ActiveFaculty, Faculty, IM, User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("IM Permissions", () => {
  let ability: AppAbility;

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
    id: "969aced6-0585-5387-a9f1-b5ca79ce3cc6",
    departmentId: "2a0723f8-d7f2-5074-a59b-e527df7c2bc1",
    userId: nonAdminUser.id
  }

  const nonAdminActiveFaculty: ActiveFaculty = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "f04cb29d-2282-5dad-8bde-2c109cee9f81",
    facultyId: nonAdminFaculty.id,
  };

  const nonOwnerActiveFaculty: ActiveFaculty = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "b0939081-a91f-5af9-b22b-084409b27142",
    facultyId: "22505759-566b-503b-b244-23ee2eac8e44"
  }

  const iM: IM = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "1b212a10-4e34-593e-96d9-41ec7a4337af",
    facultyId: nonAdminFaculty.id,
    title: "Test IM Title",
    type: "MODULE",
  };

  describe("when user is an admin", () => {
    beforeEach(() => {
      ability = iMAbility({ user: adminUser });
    });

    it("can connect iM to IMFile", () => {
      expect(ability.can("connectToIMFile", "IM")).toBe(true);
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
    describe("when user is IM owner", () => {
      beforeEach(() => {
        ability = iMAbility({
          user: nonAdminUser,
          userActiveFaculty: nonAdminActiveFaculty
        });
      });

      it("can connect iM to IMFile", () => {
        expect(ability.can("connectToIMFile", subject("IM", iM))).toBe(true);
      });
      it("can read iM", () => {
        expect(ability.can("read", subject("IM", iM))).toBe(true);
      });
      it("can update iM", () => {
        expect(ability.can("update", subject("IM", iM))).toBe(true);
      });
      it("can read iM", () => {
        expect(ability.can("delete", subject("IM", iM))).toBe(true);
      });
    });
    describe("when user is not IM owner", () => {
      beforeEach(() => {
        ability = iMAbility({
          user: nonAdminUser,
          userActiveFaculty: nonOwnerActiveFaculty
        });
      });

      it("can't connect iM to IMFile", () => {
        expect(ability.can("connectToIMFile", subject("IM", iM))).toBe(false);
      });
      it("can't read iM", () => {
        expect(ability.can("read", subject("IM", iM))).toBe(false);
      });
      it("can't update iM", () => {
        expect(ability.can("update", subject("IM", iM))).toBe(false);
      });
      it("can't read iM", () => {
        expect(ability.can("delete", subject("IM", iM))).toBe(false);
      });
    });
  });
});
