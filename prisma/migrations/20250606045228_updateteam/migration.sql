-- DropForeignKey
ALTER TABLE "public"."SoftwareAccess" DROP CONSTRAINT "SoftwareAccess_sharedAccountId_fkey";

-- AlterTable
ALTER TABLE "public"."Software" ADD COLUMN     "teamOwnerId" UUID;

-- AddForeignKey
ALTER TABLE "public"."Software" ADD CONSTRAINT "Software_teamOwnerId_fkey" FOREIGN KEY ("teamOwnerId") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoftwareAccess" ADD CONSTRAINT "SoftwareAccess_sharedAccountId_fkey" FOREIGN KEY ("sharedAccountId") REFERENCES "public"."SharedAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
