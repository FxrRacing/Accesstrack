/*
  Warnings:

  - Added the required column `accessLevel` to the `SharedAccountSoftware` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `SharedAccountSoftware` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessLevel` to the `SoftwareAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `SoftwareAccess` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."SoftwareAccess" DROP CONSTRAINT "SoftwareAccess_grantedById_fkey";

-- AlterTable
ALTER TABLE "public"."SharedAccountSoftware" ADD COLUMN     "accessLevel" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."SoftwareAccess" ADD COLUMN     "accessLevel" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;
