/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Software` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."Key" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "type" TEXT NOT NULL,
    "doorId" UUID,
    "userId" UUID,
    "locationId" UUID,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Software_name_key" ON "public"."Software"("name");

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "public"."Door"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
