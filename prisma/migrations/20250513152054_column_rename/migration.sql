/*
  Warnings:

  - You are about to drop the column `faviconUrl` on the `Software` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Software" DROP COLUMN "faviconUrl",
ADD COLUMN     "iconUrl" TEXT;
