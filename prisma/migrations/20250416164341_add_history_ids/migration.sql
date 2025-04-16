/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `SharedAccountHistory` table. All the data in the column will be lost.
  - Added the required column `updatedById` to the `SharedAccountHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SharedAccountHistory" DROP COLUMN "updatedBy",
ADD COLUMN     "updatedById" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountHistory" ADD CONSTRAINT "SharedAccountHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
