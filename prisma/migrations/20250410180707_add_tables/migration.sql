-- CreateEnum
CREATE TYPE "public"."PaymentFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH', 'CHECK', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('USER', 'SOFTWARE', 'SHARED_ACCOUNT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'unassigned',
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT,
    "location" TEXT,
    "personalEmail" TEXT,
    "reportsToId" TEXT,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "newValue" TEXT,
    "oldValue" TEXT,
    "updatedBy" TEXT NOT NULL,
    "updatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccountRep" (
    "id" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "AccountRep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Software" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userCount" INTEGER,
    "notes" TEXT,
    "notesLastUpdatedById" TEXT NOT NULL,
    "accountRep" TEXT,
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "licenseType" TEXT,
    "paymentDueDate" TIMESTAMP(3),
    "paymentFrequency" "public"."PaymentFrequency" NOT NULL DEFAULT 'MONTHLY',
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'CREDIT_CARD',
    "pricePerUser" DOUBLE PRECISION,
    "updatedById" TEXT,
    "website" TEXT,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SoftwareHistory" (
    "id" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "newValue" TEXT,
    "oldValue" TEXT,
    "updatedBy" TEXT NOT NULL,
    "updatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoftwareHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSoftware" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "grantedById" UUID NOT NULL,
    "accessLevel" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSoftware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,
    "userCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SharedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedAccountHistory" (
    "id" TEXT NOT NULL,
    "sharedAccountId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "newValue" TEXT,
    "oldValue" TEXT,
    "updatedBy" TEXT NOT NULL,
    "updatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedAccountHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SoftwareAccess" (
    "id" TEXT NOT NULL,
    "sharedAccountId" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "access" BOOLEAN NOT NULL,
    "lastEdited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEditedBy" TEXT NOT NULL,
    "permissions" TEXT[],
    "uid" TEXT NOT NULL,

    CONSTRAINT "SoftwareAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AuthUserToSoftware" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AuthUserToSoftware_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "public"."User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_personalEmail_key" ON "public"."User"("personalEmail");

-- CreateIndex
CREATE INDEX "UserHistory_userId_idx" ON "public"."UserHistory"("userId");

-- CreateIndex
CREATE INDEX "SoftwareHistory_softwareId_idx" ON "public"."SoftwareHistory"("softwareId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSoftware_userId_softwareId_key" ON "public"."UserSoftware"("userId", "softwareId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedAccount_email_key" ON "public"."SharedAccount"("email");

-- CreateIndex
CREATE INDEX "SharedAccountHistory_sharedAccountId_idx" ON "public"."SharedAccountHistory"("sharedAccountId");

-- CreateIndex
CREATE INDEX "_AuthUserToSoftware_B_index" ON "public"."_AuthUserToSoftware"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_reportsToId_fkey" FOREIGN KEY ("reportsToId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserHistory" ADD CONSTRAINT "UserHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountRep" ADD CONSTRAINT "AccountRep_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_notesLastUpdatedById_fkey" FOREIGN KEY ("notesLastUpdatedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareHistory" ADD CONSTRAINT "SoftwareHistory_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSoftware" ADD CONSTRAINT "UserSoftware_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSoftware" ADD CONSTRAINT "UserSoftware_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSoftware" ADD CONSTRAINT "UserSoftware_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccount" ADD CONSTRAINT "SharedAccount_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedAccountHistory" ADD CONSTRAINT "SharedAccountHistory_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "public"."SharedAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "public"."SharedAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "public"."Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuthUserToSoftware" ADD CONSTRAINT "_AuthUserToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuthUserToSoftware" ADD CONSTRAINT "_AuthUserToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
