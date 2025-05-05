/*
  Warnings:

  - You are about to drop the `_UserLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserLocation" DROP CONSTRAINT "_UserLocation_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserLocation" DROP CONSTRAINT "_UserLocation_B_fkey";

-- DropTable
DROP TABLE "public"."_UserLocation";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
