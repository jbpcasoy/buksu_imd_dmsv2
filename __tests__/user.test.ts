import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
import userAbility from "@/services/ability/userAbility";
import { subject } from "@casl/ability";
import { User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("User Permissions", () => {
  const user: User = {
    email: null,
    emailVerified: null,
    id: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
    image: null,
    isAdmin: false,
    name: null,
  };
  const userToUpdate: User = {
    email: null,
    emailVerified: null,
    id: "e3b887c1-6434-5fde-b8e9-5f2b7e8c2196",
    image: null,
    isAdmin: false,
    name: null,
  };
  let ability: AppAbility;

  describe("when user is an admin", () => {
    beforeEach(() => {
      ability = userAbility({ user });
    });

    it("can read user", () => {
      expect(ability.can("read", "User")).toBe(true);
    });
    it("can't create user", () => {
      expect(ability.can("create", "User")).toBe(false);
    });
    it("can update user", () => {
      expect(ability.can("update", "User")).toBe(true);
    });
    it("can't delete user", () => {
      expect(ability.can("delete", "User")).toBe(false);
    });
  });

  describe("when user is not an admin", () => {
    beforeEach(() => {
      ability = userAbility({ user });
    });

    describe("when user is not the owner", () => {
      beforeEach(() => {
        ability = userAbility({ user });
      });
      it("can't update user", () => {
        expect(ability.can("update", subject("User", userToUpdate))).toBe(false);
      });
    });

    describe("when user is the owner", () => {
      beforeEach(() => {
        ability = userAbility({ user });
      });
      it("can update user", () => {
        expect(ability.can("update", subject("User", user))).toBe(true);
      });
    });

    it("can read user", () => {
      expect(ability.can("read", "User")).toBe(true);
    });
    it("can't create user", () => {
      expect(ability.can("create", "User")).toBe(false);
    });
    it("can't delete user", () => {
      expect(ability.can("delete", "User")).toBe(false);
    });
  });
});
