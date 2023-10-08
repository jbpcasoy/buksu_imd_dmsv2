import { AppAbility } from "@/services/ability/abilityBuilder";
import iMAbility from "@/services/ability/iMAbility";
import { subject } from "@casl/ability";
import { ActiveFaculty, Faculty, IM, Prisma, User } from "@prisma/client";
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

  const nonOwnerUser: User = {
    email: null,
    emailVerified: null,
    id: "d80f38ea-6f7a-5ec9-b300-e2367f44ff7c",
    image: null,
    isAdmin: false,
    name: null,
  };

  const iM: Prisma.IMGetPayload<{
    include: {
      Faculty: {
        include: {
          ActiveFaculty: {
            include: {
              Faculty: {
                include: {
                  User: true;
                };
              };
            };
          };
        };
      };
    };
  }> = {
    id: "clnh4cexu0000tnxsa7qt2ox1",
    createdAt: new Date("2023-10-08T07:04:22.435Z"),
    updatedAt: new Date("2023-10-08T07:05:38.145Z"),
    facultyId: "clnfbu2s80005tnd84adnivtj",
    title: "Computer Programming I",
    type: "MODULE",
    Faculty: {
      id: "clnfbu2s80005tnd84adnivtj",
      createdAt: new Date("2023-10-07T00:58:31.448Z"),
      updatedAt: new Date("2023-10-07T00:58:31.448Z"),
      userId: "clnd0fogn0007tng0w91rf38b",
      departmentId: "clneimq5y0003tnmgeo3p0lyt",
      ActiveFaculty: {
        id: "clnfvg1ij0000tneoxm0rgnzc",
        createdAt: new Date("2023-10-07T10:07:28.939Z"),
        updatedAt: new Date("2023-10-07T10:07:28.939Z"),
        facultyId: "clnfbu2s80005tnd84adnivtj",
        Faculty: {
          id: "clnfbu2s80005tnd84adnivtj",
          createdAt: new Date("2023-10-07T00:58:31.448Z"),
          updatedAt: new Date("2023-10-07T00:58:31.448Z"),
          userId: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
          departmentId: "clneimq5y0003tnmgeo3p0lyt",
          User: {
            id: "1dc57fc6-3567-5448-a1f4-9adeb6e4e65f",
            name: "John Bryan Pit Devs",
            email: "johnbryanpitcasoy.dev@gmail.com",
            emailVerified: null,
            image:
              "https://lh3.googleusercontent.com/a/ACg8ocIKFH1kMnscVMI66ScHtq3a0ZKC8NXHNAWoKwCP8N5W=s96-c",
            isAdmin: false,
          },
        },
      },
    },
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
          user: nonOwnerUser,
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
