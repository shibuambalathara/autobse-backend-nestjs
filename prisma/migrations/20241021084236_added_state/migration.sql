/*
  Warnings:

  - You are about to drop the column `state` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "state",
ADD COLUMN     "stateId" TEXT;

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "name" "StateNames" NOT NULL DEFAULT 'Kerala',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_State_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_State_users_AB_unique" ON "_State_users"("A", "B");

-- CreateIndex
CREATE INDEX "_State_users_B_index" ON "_State_users"("B");

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_State_users" ADD CONSTRAINT "_State_users_A_fkey" FOREIGN KEY ("A") REFERENCES "State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_State_users" ADD CONSTRAINT "_State_users_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
