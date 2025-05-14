/*
  Warnings:

  - You are about to drop the `_AuthUserToSoftware` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_AuthUserToSoftware" DROP CONSTRAINT "_AuthUserToSoftware_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AuthUserToSoftware" DROP CONSTRAINT "_AuthUserToSoftware_B_fkey";

-- AlterTable
ALTER TABLE "public"."Software" ADD COLUMN     "assignedToId" UUID;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "offboardingDate" TIMESTAMPTZ(6),
ADD COLUMN     "onboardingDate" TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "public"."_AuthUserToSoftware";

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
