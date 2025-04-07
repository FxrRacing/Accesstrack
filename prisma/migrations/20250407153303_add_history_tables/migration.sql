/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `Software` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH', 'CHECK', 'OTHER');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('USER', 'SOFTWARE', 'SHARED_ACCOUNT');

-- AlterTable
ALTER TABLE "Software" DROP COLUMN "updatedBy",
ADD COLUMN     "accountRep" TEXT,
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "licenseType" TEXT,
ADD COLUMN     "paymentDueDate" TIMESTAMP(3),
ADD COLUMN     "paymentFrequency" "PaymentFrequency" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CREDIT_CARD',
ADD COLUMN     "pricePerUser" DOUBLE PRECISION,
ADD COLUMN     "updatedById" TEXT;

-- CreateTable
CREATE TABLE "UserHistory" (
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
CREATE TABLE "AccountRep" (
    "id" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "AccountRep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftwareHistory" (
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
CREATE TABLE "SharedAccount" (
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
CREATE TABLE "SharedAccountHistory" (
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
CREATE TABLE "SoftwareAccess" (
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

-- CreateIndex
CREATE INDEX "UserHistory_userId_idx" ON "UserHistory"("userId");

-- CreateIndex
CREATE INDEX "SoftwareHistory_softwareId_idx" ON "SoftwareHistory"("softwareId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedAccount_email_key" ON "SharedAccount"("email");

-- CreateIndex
CREATE INDEX "SharedAccountHistory_sharedAccountId_idx" ON "SharedAccountHistory"("sharedAccountId");

-- AddForeignKey
ALTER TABLE "UserHistory" ADD CONSTRAINT "UserHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountRep" ADD CONSTRAINT "AccountRep_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareHistory" ADD CONSTRAINT "SoftwareHistory_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedAccount" ADD CONSTRAINT "SharedAccount_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedAccountHistory" ADD CONSTRAINT "SharedAccountHistory_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "SharedAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "SharedAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
