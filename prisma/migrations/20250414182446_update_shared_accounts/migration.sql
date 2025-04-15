/*
  Warnings:

  - Added the required column `grantedById` to the `SoftwareAccess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Software" ADD COLUMN     "faviconUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."SoftwareAccess" ADD COLUMN     "grantedById" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
