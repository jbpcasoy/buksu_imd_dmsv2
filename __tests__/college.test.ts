import { AppAbility } from "@/services/ability/abilityBuilder";
import collegeAbility from "@/services/ability/collegeAbility";
import { User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("College Permissions", () => {
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
      ability = collegeAbility({user});
    });

    it("can read college", () => {
      expect(ability.can("read", "College")).toBe(true);
    });
    it("can create college", () => {
      expect(ability.can("create", "College")).toBe(true);
    });
    it("can update college", () => {
      expect(ability.can("update", "College")).toBe(true);
    });
    it("can delete college", () => {
      expect(ability.can("delete", "College")).toBe(true);
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
      ability = collegeAbility({user});
    });

    it("can read college", () => {
      expect(ability.can("read", "College")).toBe(true);
    });
    it("can't create college", () => {
      expect(ability.can("create", "College")).toBe(false);
    });
    it("can't update college", () => {
      expect(ability.can("update", "College")).toBe(false);
    });
    it("can't delete college", () => {
      expect(ability.can("delete", "College")).toBe(false);
    });
  });
});
