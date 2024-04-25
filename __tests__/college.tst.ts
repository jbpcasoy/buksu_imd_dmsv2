import { prismaMock } from "@/prisma/singleton";
import {
  createCollege,
  deleteCollege,
  readCollege,
  readColleges,
  updateCollege,
} from "@/services/collegeService";
import { College, User } from "@prisma/client";

const adminUser: User = {
  id: "clventgry000020jex6bravtc",
  name: "Harriett Gregory",
  email: "mur@zipo.cz",
  emailVerified: null,
  image: "http://de.gl/ropus",
  isAdmin: true,
};
const nonAdminUser: User = {
  id: "clventgry000020jex6bravtc",
  name: "Ina Weaver",
  email: "sarvakjaz@gupul.tp",
  emailVerified: null,
  image: "http://joknum.nz/filuv",
  isAdmin: false,
};

const college: College = {
  id: "clveswte60002p8yaq1khl7ub",
  createdAt: new Date("2024-04-25T05:26:25.230Z"),
  updatedAt: new Date("2024-04-25T05:26:25.230Z"),
  name: "Information Technology",
};

describe("Action: CREATE College", () => {
  describe("Role: Admin", () => {
    test("Scenario: Unique Name", async () => {
      prismaMock.college.create.mockResolvedValueOnce(college);

      await expect(
        createCollege({ user: adminUser, name: "Information Technology" })
      ).resolves.toEqual(college);
    });

    test("Scenario: Duplicate Name", async () => {
      prismaMock.college.findFirst.mockResolvedValueOnce(college);
      prismaMock.college.create.mockResolvedValueOnce(college);

      await expect(
        createCollege({ user: adminUser, name: "Information Technology" })
      ).rejects.toThrow("College name is already used");
    });
  });

  test("Role: User", async () => {
    prismaMock.college.create.mockResolvedValueOnce(college);

    await expect(
      createCollege({ user: nonAdminUser, name: "Information Technology" })
    ).rejects.toThrow("You are not allowed to create a college");
  });
});

describe("Action: READ Colleges", () => {
  test("Role: User", async () => {
    prismaMock.college.findMany.mockResolvedValueOnce([college]);
    prismaMock.college.count.mockResolvedValueOnce(1);

    await expect(readColleges({ skip: 0, take: 10 })).resolves.toEqual({
      colleges: [college],
      count: 1,
    });
  });
});

describe("Action: READ College", () => {
  test("Role: User", async () => {
    prismaMock.college.findUnique.mockResolvedValueOnce(college);

    await expect(
      readCollege({ id: "clveswte60002p8yaq1khl7ub" })
    ).resolves.toEqual(college);
  });
});

describe("Action: UPDATE College", () => {
  describe("Role: Admin", () => {
    test("Scenario: Unique Name", async () => {
      prismaMock.college.update.mockResolvedValueOnce(college);

      await expect(
        updateCollege({
          user: adminUser,
          id: "clveswte60002p8yaq1khl7ub",
          name: "Information Technology",
        })
      ).resolves.toEqual(college);
    });

    test("Scenario: Duplicate Name", async () => {
      prismaMock.college.update.mockResolvedValueOnce(college);
      prismaMock.college.findFirst.mockResolvedValueOnce(college);

      await expect(
        updateCollege({
          user: adminUser,
          id: "clveswte60002p8yaq1khl7ub",
          name: "Information Technology",
        })
      ).rejects.toThrow("College name is already used");
    });
  });

  test("Role: User", async () => {
    prismaMock.college.update.mockResolvedValueOnce(college);

    await expect(
      updateCollege({
        user: nonAdminUser,
        id: "clveswte60002p8yaq1khl7ub",
        name: "Information Technology",
      })
    ).rejects.toThrow("You are not allowed to update this college");
  });
});

describe("Action: DELETE College", () => {
  test("Role: Admin", async () => {
    prismaMock.college.delete.mockResolvedValueOnce(college);

    await expect(
      deleteCollege({ user: adminUser, id: "clveswte60002p8yaq1khl7ub" })
    ).resolves.toEqual(college);
  });

  test("Role: User", async () => {
    prismaMock.college.delete.mockResolvedValueOnce(college);

    await expect(
      deleteCollege({ user: nonAdminUser, id: "clveswte60002p8yaq1khl7ub" })
    ).rejects.toThrow("You are not allowed to delete this college");
  });
});
