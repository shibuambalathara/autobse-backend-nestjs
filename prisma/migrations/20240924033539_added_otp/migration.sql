/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `paymentFor` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('registrations', 'emd', 'openBids');

-- CreateEnum
CREATE TYPE "ContactUsStatusType" AS ENUM ('created', 'solved');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_statusId_fkey";

-- DropIndex
DROP INDEX "Payment_createdBy_key";

-- DropIndex
DROP INDEX "Payment_statusId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "createdBy",
DROP COLUMN "statusId",
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "paymentFor" "PaymentType" NOT NULL,
ADD COLUMN     "status" "PaymentStatusTypes" DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otp_gen" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "state" "StateNames" NOT NULL,
    "mobile" TEXT NOT NULL,
    "message" TEXT DEFAULT '',
    "status" "ContactUsStatusType" DEFAULT 'created',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
