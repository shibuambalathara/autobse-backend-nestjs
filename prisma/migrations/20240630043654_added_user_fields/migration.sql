/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tempToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ADD COLUMN     "BalanceEMDAmount" INTEGER DEFAULT 0,
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "businessName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dealerId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "dealership_extension" TEXT,
ADD COLUMN     "dealership_filesize" INTEGER,
ADD COLUMN     "dealership_height" INTEGER,
ADD COLUMN     "dealership_id" TEXT,
ADD COLUMN     "dealership_width" INTEGER,
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "idNo" SERIAL NOT NULL,
ADD COLUMN     "idProofBack_extension" TEXT,
ADD COLUMN     "idProofBack_filesize" INTEGER,
ADD COLUMN     "idProofBack_height" INTEGER,
ADD COLUMN     "idProofBack_id" TEXT,
ADD COLUMN     "idProofBack_width" INTEGER,
ADD COLUMN     "idProofNo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "idProof_extension" TEXT,
ADD COLUMN     "idProof_filesize" INTEGER,
ADD COLUMN     "idProof_height" INTEGER,
ADD COLUMN     "idProof_id" TEXT,
ADD COLUMN     "idProof_width" INTEGER,
ADD COLUMN     "image_extension" TEXT,
ADD COLUMN     "image_filesize" INTEGER,
ADD COLUMN     "image_height" INTEGER,
ADD COLUMN     "image_id" TEXT,
ADD COLUMN     "image_width" INTEGER,
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "mobile" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pancardNo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pancard_extension" TEXT,
ADD COLUMN     "pancard_filesize" INTEGER,
ADD COLUMN     "pancard_height" INTEGER,
ADD COLUMN     "pancard_id" TEXT,
ADD COLUMN     "pancard_width" INTEGER,
ADD COLUMN     "tempToken" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "userCategory" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "password" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "User_idNo_key" ON "User"("idNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_tempToken_key" ON "User"("tempToken");
