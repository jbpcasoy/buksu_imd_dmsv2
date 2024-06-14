import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';
import logger from "@/services/logger";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(400).send("This route is only for testing!");
  }

  if (req.method === "GET") {
    await prisma.profilePictureFile.deleteMany();
    await prisma.iM.deleteMany();
    await prisma.activeCITLDirector.deleteMany();
    await prisma.cITLDirector.deleteMany();
    await prisma.activeIDDCoordinator.deleteMany();
    await prisma.iDDCoordinator.deleteMany();
    await prisma.activeContentSpecialist.deleteMany();
    await prisma.contentSpecialist.deleteMany();
    await prisma.activeDean.deleteMany();
    await prisma.dean.deleteMany();
    await prisma.activeCoordinator.deleteMany();
    await prisma.coordinator.deleteMany();
    await prisma.activeChairperson.deleteMany();
    await prisma.chairperson.deleteMany();
    await prisma.activeFaculty.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.department.deleteMany();
    await prisma.college.deleteMany();

    deleteFiles();

    return res.status(200).send("Reset finished");
  } else {
    return res.status(405).send(`${req.method} not allowed`);
  }
}

function deleteFiles() {
  // Path to the directory containing the files
  const qamisDir = path.join(process.cwd(), '/files/qamis/');
  const imDir = path.join(process.cwd(), '/files/im/');
  const plagiarismDir = path.join(process.cwd(), '/files/plagiarism/');
  const profileDir = path.join(process.cwd(), '/files/profile_picture/');

  deleteFilesOnFolder(qamisDir);
  deleteFilesOnFolder(imDir);
  deleteFilesOnFolder(plagiarismDir);
  deleteFilesOnFolder(profileDir);
}


function deleteFilesOnFolder(dirPath: string) {
  // Read the directory
  fs.readdir(dirPath, (error, files) => {
    if (error) {
      logger.error({ error });
      throw error;
    }

    // Loop through each file and delete it
    files.forEach(file => {
      if(file === "test.txt") {
        return;
      }

      const filePath = path.join(dirPath, file);
      
      fs.unlink(filePath, (error) => {
        if (error) {
          logger.error({ error });
          throw error;
        }
      });
    });
  });
}