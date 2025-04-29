/*
  Warnings:

  - You are about to drop the `AccountRep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SharedAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SharedAccountHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SharedAccountSoftware` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SharedAccountUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Software` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoftwareAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoftwareHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSoftware` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AuthUserToSoftware` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SoftwareHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AccountRep" DROP CONSTRAINT "AccountRep_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invites" DROP CONSTRAINT "Invites_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccount" DROP CONSTRAINT "SharedAccount_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountHistory" DROP CONSTRAINT "SharedAccountHistory_sharedAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountHistory" DROP CONSTRAINT "SharedAccountHistory_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountSoftware" DROP CONSTRAINT "SharedAccountSoftware_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountSoftware" DROP CONSTRAINT "SharedAccountSoftware_sharedAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountSoftware" DROP CONSTRAINT "SharedAccountSoftware_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountUser" DROP CONSTRAINT "SharedAccountUser_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountUser" DROP CONSTRAINT "SharedAccountUser_sharedAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SharedAccountUser" DROP CONSTRAINT "SharedAccountUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Software" DROP CONSTRAINT "Software_notesLastUpdatedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Software" DROP CONSTRAINT "Software_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."SoftwareAccess" DROP CONSTRAINT "SoftwareAccess_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SoftwareHistory" DROP CONSTRAINT "SoftwareHistory_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_reportsToId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserHistory" DROP CONSTRAINT "UserHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSoftware" DROP CONSTRAINT "UserSoftware_grantedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSoftware" DROP CONSTRAINT "UserSoftware_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSoftware" DROP CONSTRAINT "UserSoftware_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AuthUserToSoftware" DROP CONSTRAINT "_AuthUserToSoftware_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AuthUserToSoftware" DROP CONSTRAINT "_AuthUserToSoftware_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SoftwareHistory" DROP CONSTRAINT "_SoftwareHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SoftwareHistory" DROP CONSTRAINT "_SoftwareHistory_B_fkey";

-- DropTable
DROP TABLE "public"."AccountRep";

-- DropTable
DROP TABLE "public"."Invites";

-- DropTable
DROP TABLE "public"."SharedAccount";

-- DropTable
DROP TABLE "public"."SharedAccountHistory";

-- DropTable
DROP TABLE "public"."SharedAccountSoftware";

-- DropTable
DROP TABLE "public"."SharedAccountUser";

-- DropTable
DROP TABLE "public"."Software";

-- DropTable
DROP TABLE "public"."SoftwareAccess";

-- DropTable
DROP TABLE "public"."SoftwareHistory";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."UserHistory";

-- DropTable
DROP TABLE "public"."UserSoftware";

-- DropTable
DROP TABLE "public"."_AuthUserToSoftware";

-- DropTable
DROP TABLE "public"."_SoftwareHistory";

-- DropTable
DROP TABLE "public"."user_profiles";

-- DropEnum
DROP TYPE "public"."EntityType";

-- DropEnum
DROP TYPE "public"."PaymentFrequency";

-- DropEnum
DROP TYPE "public"."PaymentMethod";
