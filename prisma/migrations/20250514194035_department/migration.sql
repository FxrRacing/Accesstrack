-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "departmentId" UUID;

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "departmentHeadId" UUID,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_departmentHeadId_key" ON "public"."Department"("departmentHeadId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_departmentHeadId_fkey" FOREIGN KEY ("departmentHeadId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
