-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "public"."PaymentFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH', 'CHECK', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Invites" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'FULFILLED',

    CONSTRAINT "Invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'unassigned',
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT,
    "location" TEXT,
    "locationId" UUID,
    "personalEmail" TEXT,
    "reportsToId" UUID,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "onboardingDate" TIMESTAMPTZ(6),
    "offboardingDate" TIMESTAMPTZ(6),
    "departmentId" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserHistory" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "newValue" TEXT,
    "oldValue" TEXT,
    "updatedById" UUID NOT NULL,
    "updatedOn" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Software" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" TEXT DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "userCount" INTEGER,
    "notes" TEXT,
    "notesLastUpdatedById" UUID,
    "accountRep" TEXT,
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "licenseType" TEXT,
    "paymentDueDate" TIMESTAMP(3),
    "paymentFrequency" "public"."PaymentFrequency" NOT NULL DEFAULT 'MONTHLY',
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'CREDIT_CARD',
    "pricePerUser" DOUBLE PRECISION,
    "updatedById" UUID,
    "website" TEXT,
    "iconUrl" TEXT,
    "assignedToId" UUID,
    "purchaseDate" TIMESTAMP(3),
    "employeeNumber" TEXT,
    "teamOwnerId" UUID,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSoftware" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "softwareId" UUID NOT NULL,
    "grantedById" UUID NOT NULL,
    "accessLevel" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSoftware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SoftwareAccess" (
    "id" UUID NOT NULL,
    "sharedAccountId" UUID NOT NULL,
    "softwareId" UUID NOT NULL,
    "access" BOOLEAN NOT NULL,
    "lastEdited" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEditedBy" UUID NOT NULL,
    "permissions" TEXT[],
    "accessLevel" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "grantedById" UUID NOT NULL,

    CONSTRAINT "SoftwareAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SoftwareHistory" (
    "id" UUID NOT NULL,
    "softwareId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "newValue" TEXT,
    "oldValue" TEXT,
    "updatedById" UUID NOT NULL,
    "updatedOn" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoftwareHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccountRep" (
    "id" UUID NOT NULL,
    "softwareId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "AccountRep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedAccount" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID NOT NULL,
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "SharedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedAccountHistory" (
    "id" UUID NOT NULL,
    "sharedAccountId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "newValue" TEXT,
    "oldValue" TEXT,
    "updatedById" UUID NOT NULL,
    "updatedOn" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedAccountHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedAccountSoftware" (
    "id" UUID NOT NULL,
    "sharedAccountId" UUID NOT NULL,
    "softwareId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessLevel" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "SharedAccountSoftware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedAccountUser" (
    "id" UUID NOT NULL,
    "sharedAccountId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedAccountUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactID" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "color" TEXT,
    "departmentHeadId" UUID,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OperatingHour" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "dayOfWeek" "public"."DayOfWeek" NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL,
    "closeTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatingHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Door" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "locationId" UUID NOT NULL,
    "status" TEXT,
    "accessLevel" TEXT,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."KeyCard" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "type" TEXT NOT NULL,
    "userId" UUID,

    CONSTRAINT "KeyCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KeyCardDoor" (
    "id" UUID NOT NULL,
    "keyCardId" UUID NOT NULL,
    "doorId" UUID NOT NULL,

    CONSTRAINT "KeyCardDoor_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "public"."_SoftwareHistory" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_SoftwareHistory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invites_email_key" ON "public"."Invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "public"."User"("name");

-- CreateIndex
CREATE INDEX "UserHistory_userId_idx" ON "public"."UserHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Software_name_key" ON "public"."Software"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSoftware_userId_softwareId_key" ON "public"."UserSoftware"("userId", "softwareId");

-- CreateIndex
CREATE INDEX "SoftwareHistory_softwareId_idx" ON "public"."SoftwareHistory"("softwareId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedAccount_email_key" ON "public"."SharedAccount"("email");

-- CreateIndex
CREATE INDEX "SharedAccountHistory_sharedAccountId_idx" ON "public"."SharedAccountHistory"("sharedAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedAccountSoftware_sharedAccountId_softwareId_key" ON "public"."SharedAccountSoftware"("sharedAccountId", "softwareId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedAccountUser_sharedAccountId_userId_key" ON "public"."SharedAccountUser"("sharedAccountId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "OperatingHour_locationId_dayOfWeek_key" ON "public"."OperatingHour"("locationId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "KeyCardLocation_keyCardId_locationId_key" ON "public"."KeyCardLocation"("keyCardId", "locationId");

-- CreateIndex
CREATE INDEX "_SoftwareHistory_B_index" ON "public"."_SoftwareHistory"("B");

-- AddForeignKey
ALTER TABLE "public"."Invites" ADD CONSTRAINT "Invites_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_reportsToId_fkey" FOREIGN KEY ("reportsToId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserHistory" ADD CONSTRAINT "UserHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserHistory" ADD CONSTRAINT "UserHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_teamOwnerId_fkey" FOREIGN KEY ("teamOwnerId") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_notesLastUpdatedById_fkey" FOREIGN KEY ("notesLastUpdatedById") REFERENCES "public"."user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSoftware" ADD CONSTRAINT "UserSoftware_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSoftware" ADD CONSTRAINT "UserSoftware_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSoftware" ADD CONSTRAINT "UserSoftware_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "public"."SharedAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareHistory" ADD CONSTRAINT "SoftwareHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareHistory" ADD CONSTRAINT "SoftwareHistory_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountRep" ADD CONSTRAINT "AccountRep_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccount" ADD CONSTRAINT "SharedAccount_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountHistory" ADD CONSTRAINT "SharedAccountHistory_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "public"."SharedAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountHistory" ADD CONSTRAINT "SharedAccountHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountSoftware" ADD CONSTRAINT "SharedAccountSoftware_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "public"."SharedAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountSoftware" ADD CONSTRAINT "SharedAccountSoftware_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountSoftware" ADD CONSTRAINT "SharedAccountSoftware_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountUser" ADD CONSTRAINT "SharedAccountUser_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "public"."SharedAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountUser" ADD CONSTRAINT "SharedAccountUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountUser" ADD CONSTRAINT "SharedAccountUser_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_contactID_fkey" FOREIGN KEY ("contactID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_departmentHeadId_fkey" FOREIGN KEY ("departmentHeadId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OperatingHour" ADD CONSTRAINT "OperatingHour_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Door" ADD CONSTRAINT "Door_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "public"."Door"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCard" ADD CONSTRAINT "KeyCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCardDoor" ADD CONSTRAINT "KeyCardDoor_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "public"."Door"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCardDoor" ADD CONSTRAINT "KeyCardDoor_keyCardId_fkey" FOREIGN KEY ("keyCardId") REFERENCES "public"."KeyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCardLocation" ADD CONSTRAINT "KeyCardLocation_keyCardId_fkey" FOREIGN KEY ("keyCardId") REFERENCES "public"."KeyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeyCardLocation" ADD CONSTRAINT "KeyCardLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SoftwareHistory" ADD CONSTRAINT "_SoftwareHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SoftwareHistory" ADD CONSTRAINT "_SoftwareHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."SoftwareHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
