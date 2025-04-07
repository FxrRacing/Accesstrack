/*
  Warnings:

  - You are about to drop the `SoftwareHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoftwareUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notesLastUpdatedById` to the `Software` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SoftwareHistory" DROP CONSTRAINT "SoftwareHistory_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareUser" DROP CONSTRAINT "SoftwareUser_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareUser" DROP CONSTRAINT "SoftwareUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_reportsToId_fkey";

-- AlterTable
ALTER TABLE "Software" ADD COLUMN     "notesLastUpdatedById" TEXT NOT NULL;

-- DropTable
DROP TABLE "SoftwareHistory";

-- DropTable
DROP TABLE "SoftwareUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_reportsToId_fkey" FOREIGN KEY ("reportsToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_notesLastUpdatedById_fkey" FOREIGN KEY ("notesLastUpdatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
