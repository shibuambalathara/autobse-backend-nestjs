/*
  Warnings:

  - You are about to drop the column `dealership_extension` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dealership_filesize` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dealership_height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dealership_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dealership_width` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProofBack_extension` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProofBack_filesize` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProofBack_height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProofBack_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProofBack_width` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProof_extension` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProof_filesize` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProof_height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProof_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idProof_width` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image_extension` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image_filesize` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image_height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image_width` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pancard_extension` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pancard_filesize` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pancard_height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pancard_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pancard_width` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dealership_extension",
DROP COLUMN "dealership_filesize",
DROP COLUMN "dealership_height",
DROP COLUMN "dealership_id",
DROP COLUMN "dealership_width",
DROP COLUMN "idProofBack_extension",
DROP COLUMN "idProofBack_filesize",
DROP COLUMN "idProofBack_height",
DROP COLUMN "idProofBack_id",
DROP COLUMN "idProofBack_width",
DROP COLUMN "idProof_extension",
DROP COLUMN "idProof_filesize",
DROP COLUMN "idProof_height",
DROP COLUMN "idProof_id",
DROP COLUMN "idProof_width",
DROP COLUMN "image_extension",
DROP COLUMN "image_filesize",
DROP COLUMN "image_height",
DROP COLUMN "image_id",
DROP COLUMN "image_width",
DROP COLUMN "pancard_extension",
DROP COLUMN "pancard_filesize",
DROP COLUMN "pancard_height",
DROP COLUMN "pancard_id",
DROP COLUMN "pancard_width";
