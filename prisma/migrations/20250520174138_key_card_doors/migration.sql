/*
  Warnings:

  - You are about to drop the column `doorId` on the `KeyCard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."KeyCard" DROP CONSTRAINT "KeyCard_doorId_fkey";

-- AlterTable
ALTER TABLE "public"."KeyCard" DROP COLUMN "doorId";

-- CreateTable
CREATE TABLE "public"."KeyCardDoor" (
    "id" UUID NOT NULL,
    "keyCardId" UUID NOT NULL,
    "doorId" UUID NOT NULL,

    CONSTRAINT "KeyCardDoor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."KeyCardDoor" ADD CONSTRAINT "KeyCardDoor_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "public"."Door"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCardDoor" ADD CONSTRAINT "KeyCardDoor_keyCardId_fkey" FOREIGN KEY ("keyCardId") REFERENCES "public"."KeyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
