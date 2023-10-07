import { AppAbility } from "@/services/ability/abilityBuilder";
import facultyAbility from "@/services/ability/facultyAbility";
import { User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("Faculty Permissions", () => {
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
      ability = facultyAbility({user});
    });

    it("can read faculty", () => {
      expect(ability.can("read", "Faculty")).toBe(true);
    });
    it("can create faculty", () => {
      expect(ability.can("create", "Faculty")).toBe(true);
    });
    it("can delete faculty", () => {
      expect(ability.can("delete", "Faculty")).toBe(true);
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
      ability = facultyAbility({user});
    });

    it("can read faculty", () => {
      expect(ability.can("read", "Faculty")).toBe(true);
    });
    it("can't create faculty", () => {
      expect(ability.can("create", "Faculty")).toBe(false);
    });
    it("can't delete faculty", () => {
      expect(ability.can("delete", "Faculty")).toBe(false);
    });
  });
});
