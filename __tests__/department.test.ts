import { AppAbility } from "@/services/ability/abilityBuilder";
import departmentAbility from "@/services/ability/departmentAbility";
import { User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("Department Permissions", () => {
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
      ability = departmentAbility({user});
    });

    it("can read department", () => {
      expect(ability.can("read", "Department")).toBe(true);
    });
    it("can create department", () => {
      expect(ability.can("create", "Department")).toBe(true);
    });
    it("can update department", () => {
      expect(ability.can("update", "Department")).toBe(true);
    });
    it("can delete department", () => {
      expect(ability.can("delete", "Department")).toBe(true);
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
      ability = departmentAbility({user});
    });

    it("can read department", () => {
      expect(ability.can("read", "Department")).toBe(true);
    });
    it("can't create department", () => {
      expect(ability.can("create", "Department")).toBe(false);
    });
    it("can't update department", () => {
      expect(ability.can("update", "Department")).toBe(false);
    });
    it("can't delete department", () => {
      expect(ability.can("delete", "Department")).toBe(false);
    });
  });
});
