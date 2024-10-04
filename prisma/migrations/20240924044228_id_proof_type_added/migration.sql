-- CreateEnum
CREATE TYPE "UserIdProofTypeType" AS ENUM ('aadhar', 'drivingLicense', 'passport');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "idProofType" "UserIdProofTypeType";
