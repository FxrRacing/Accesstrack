-- DropForeignKey
ALTER TABLE "public"."Invites" DROP CONSTRAINT "Invites_createdById_fkey";

-- AddForeignKey
ALTER TABLE "public"."Invites" ADD CONSTRAINT "Invites_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
