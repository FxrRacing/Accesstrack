-- CreateTable
CREATE TABLE "public"."KeyCard" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "type" TEXT NOT NULL,
    "doorId" UUID,
    "userId" UUID,

    CONSTRAINT "KeyCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KeyCardLocation" (
    "id" UUID NOT NULL,
    "keyCardId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "KeyCardLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KeyCardLocation_keyCardId_locationId_key" ON "public"."KeyCardLocation"("keyCardId", "locationId");

-- AddForeignKey
ALTER TABLE "public"."KeyCard" ADD CONSTRAINT "KeyCard_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "public"."Door"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCard" ADD CONSTRAINT "KeyCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCardLocation" ADD CONSTRAINT "KeyCardLocation_keyCardId_fkey" FOREIGN KEY ("keyCardId") REFERENCES "public"."KeyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCardLocation" ADD CONSTRAINT "KeyCardLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
