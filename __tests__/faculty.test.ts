import { AppAbility } from "@/services/ability/abilityBuilder";
import facultyAbility from "@/services/ability/facultyAbility";
import { subject } from "@casl/ability";
import { Faculty, User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("Faculty Permissions", () => {
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
    id: "fd69cd5f-f288-5d58-ba9b-dd0c8db87235",
    userId: nonAdminUser.id,
    departmentId: "154c2612-ead9-5470-aa0d-b792a7fbf59d",
  };

  const nonOwnedFaculty: Faculty = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "41b587b5-7f82-5303-83fa-184520a969ff",
    userId: "ab36b295-ff1e-56c2-aaf5-8ec289a8207a",
    departmentId: "154c2612-ead9-5470-aa0d-b792a7fbf59d",
  };

  describe("when user is an admin", () => {
    beforeEach(() => {
      ability = facultyAbility({ user: adminUser });
    });

    it("can connect faculty to im", () => {
      expect(
        ability.can("connectToIM", subject("Faculty", nonOwnedFaculty))
      ).toBe(true);
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
      ability = facultyAbility({ user: nonAdminUser });
    });

    describe("when user is faculty owner", () => {
      it("can't connect faculty to im", () => {
        expect(
          ability.can("connectToIM", subject("Faculty", nonAdminFaculty))
        ).toBe(true);
      });
    });
    describe("when user is not faculty owner", () => {
      it("can't connect faculty to im", () => {
        expect(
          ability.can("connectToIM", subject("Faculty", nonOwnedFaculty))
        ).toBe(false);
      });
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
