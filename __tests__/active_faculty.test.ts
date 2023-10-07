import { AppAbility } from "@/services/ability/abilityBuilder";
import activeFacultyAbility from "@/services/ability/activeFacultyAbility";
import { User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("ActiveFaculty Permissions", () => {
  let user: User;
  let ability: AppAbility;

  describe("when user is an admin", () => {
    beforeEach(() => {
      user = {
        email: null,
        emailVerified: null,
        id: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
        image: null,
        isAdmin: true,
        name: null,
      };
      ability = activeFacultyAbility({user});
    });

    it("can read activeFaculty", () => {
      expect(ability.can("read", "ActiveFaculty")).toBe(true);
    });
    it("can create activeFaculty", () => {
      expect(ability.can("create", "ActiveFaculty")).toBe(true);
    });
    it("can delete activeFaculty", () => {
      expect(ability.can("delete", "ActiveFaculty")).toBe(true);
    });
  });

  describe("when user is not an admin", () => {
    beforeEach(() => {
      user = {
        email: null,
        emailVerified: null,
        id: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
        image: null,
        isAdmin: false,
        name: null,
      };
      ability = activeFacultyAbility({user});
    });

    it("can read activeFaculty", () => {
      expect(ability.can("read", "ActiveFaculty")).toBe(true);
    });
    it("can't create activeFaculty", () => {
      expect(ability.can("create", "ActiveFaculty")).toBe(false);
    });
    it("can't delete activeFaculty", () => {
      expect(ability.can("delete", "ActiveFaculty")).toBe(false);
    });
  });
});
