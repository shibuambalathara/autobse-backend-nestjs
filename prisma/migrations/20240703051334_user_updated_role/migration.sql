-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('admin', 'staff', 'seller', 'dealer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRoleType" DEFAULT 'dealer';
