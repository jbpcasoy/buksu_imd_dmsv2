import { AppAbility } from "@/services/ability/abilityBuilder";
import userAbility from "@/services/ability/userAbility";
import { User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("User Permissions", () => {
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
      ability = userAbility({user});
    });

    it("can read user", () => {
      expect(ability.can("read", "User")).toBe(true);
    });
    it("can't create user", () => {
      expect(ability.can("create", "User")).toBe(false);
    });
    it("can't update user", () => {
      expect(ability.can("update", "User")).toBe(false);
    });
    it("can't delete user", () => {
      expect(ability.can("delete", "User")).toBe(false);
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
      ability = userAbility({user});
    });

    it("can read user", () => {
      expect(ability.can("read", "User")).toBe(true);
    });
    it("can't create user", () => {
      expect(ability.can("create", "User")).toBe(false);
    });
    it("can't update user", () => {
      expect(ability.can("update", "User")).toBe(false);
    });
    it("can't delete user", () => {
      expect(ability.can("delete", "User")).toBe(false);
    });
  });
});
