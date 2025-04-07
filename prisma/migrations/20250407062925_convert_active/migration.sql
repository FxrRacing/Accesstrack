/*
  Warnings:

  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "active",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
