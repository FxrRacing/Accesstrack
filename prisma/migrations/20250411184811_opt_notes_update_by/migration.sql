-- DropForeignKey
ALTER TABLE "public"."Software" DROP CONSTRAINT "Software_notesLastUpdatedById_fkey";

-- AlterTable
ALTER TABLE "public"."Software" ALTER COLUMN "notesLastUpdatedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_notesLastUpdatedById_fkey" FOREIGN KEY ("notesLastUpdatedById") REFERENCES "public"."user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
