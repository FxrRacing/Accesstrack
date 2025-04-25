/*
  Warnings:

  - Added the required column `fullName` to the `Invites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Invites" ADD COLUMN     "fullName" TEXT NOT NULL;
