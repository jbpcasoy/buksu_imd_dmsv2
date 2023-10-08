import { AppAbility } from "@/services/ability/abilityBuilder";
import iMFileAbility from "@/services/ability/iMFileAbility";
import { subject } from "@casl/ability";
import { ActiveFaculty, Faculty, IMFile, Prisma, User } from "@prisma/client";
import "@testing-library/jest-dom";

describe("IMFile Permissions", () => {
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
    id: "49b9c0f2-89a9-5d2c-beab-7b38e137aaba",
    image: null,
    isAdmin: false,
    name: null,
  };

  const nonOwnerUser: User = {
    email: null,
    emailVerified: null,
    id: "2e782ebf-c7d5-5ef4-9faa-eb6f1478017c",
    image: null,
    isAdmin: false,
    name: null,
  };

  const iMFile: Prisma.IMFileGetPayload<{
    include: {
      IM: {
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
      };
    };
  }> = {
    id: "clnh3jyfg0001tnuoaom4367y",
    createdAt: new Date("2023-10-08T06:42:14.668Z"),
    updatedAt: new Date("2023-10-08T06:42:14.668Z"),
    iMId: "clnh2bplu0006tn5g80u8n67p",
    filename: "7744cf877152e1eae5e22ce01.pdf",
    IM: {
      id: "clnh2bplu0006tn5g80u8n67p",
      createdAt: new Date("2023-10-08T06:07:50.370Z"),
      updatedAt: new Date("2023-10-08T06:07:50.370Z"),
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
            userId: "49b9c0f2-89a9-5d2c-beab-7b38e137aaba",
            departmentId: "clneimq5y0003tnmgeo3p0lyt",
            User: {
              id: "49b9c0f2-89a9-5d2c-beab-7b38e137aaba",
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
    },
  };

  describe("when user is an admin", () => {
    beforeEach(() => {
      ability = iMFileAbility({ user: adminUser });
    });

    it("can read iM", () => {
      expect(ability.can("read", "IMFile")).toBe(true);
    });
    it("can delete iM", () => {
      expect(ability.can("delete", "IMFile")).toBe(true);
    });
  });

  describe("when user is not an admin", () => {
    describe("when user is IMFile owner", () => {
      beforeEach(() => {
        ability = iMFileAbility({
          user: nonAdminUser,
        });
      });

      it("can read iM", () => {
        expect(ability.can("read", subject("IMFile", iMFile))).toBe(true);
      });
      it("can delete iM", () => {
        expect(ability.can("delete", subject("IMFile", iMFile))).toBe(true);
      });
    });
    describe("when user is not IMFile owner", () => {
      beforeEach(() => {
        ability = iMFileAbility({
          user: nonOwnerUser,
        });
      });

      it("can't read iM", () => {
        expect(ability.can("read", subject("IMFile", iMFile))).toBe(false);
      });
      it("can't delete iM", () => {
        expect(ability.can("delete", subject("IMFile", iMFile))).toBe(false);
      });
    });
  });
});
