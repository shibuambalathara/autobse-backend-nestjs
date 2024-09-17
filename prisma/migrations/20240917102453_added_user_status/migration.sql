-- CreateEnum
CREATE TYPE "UserStatusType" AS ENUM ('pending', 'blocked', 'active', 'inactive');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatusType" DEFAULT 'pending';
