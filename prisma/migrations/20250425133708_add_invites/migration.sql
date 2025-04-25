-- CreateTable
CREATE TABLE "public"."Invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invites_email_key" ON "public"."Invites"("email");

-- AddForeignKey
ALTER TABLE "public"."Invites" ADD CONSTRAINT "Invites_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
