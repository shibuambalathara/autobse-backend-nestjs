/*
  Warnings:

  - Added the required column `eventCategory` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('open', 'online');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventCategory",
ADD COLUMN     "eventCategory" "EventCategory" NOT NULL;
