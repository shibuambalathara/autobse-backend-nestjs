-- CreateEnum
CREATE TYPE "VehicleBidStatusType" AS ENUM ('pending', 'approved', 'fulfilled', 'declined');

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('admin', 'staff', 'seller', 'dealer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "UserRoleType" NOT NULL DEFAULT 'dealer';

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'india',
    "stateId" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VehicleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "contactPerson" TEXT NOT NULL DEFAULT '',
    "GSTNumber" TEXT NOT NULL DEFAULT '',
    "billingContactPerson" TEXT NOT NULL DEFAULT '',
    "mobile" TEXT NOT NULL DEFAULT '',
    "nationalHead" TEXT NOT NULL DEFAULT '',
    "logo" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vehicleIndexNo" SERIAL NOT NULL,
    "registrationNumber" TEXT NOT NULL DEFAULT '',
    "bidTimeExpire" TIMESTAMP(3) NOT NULL,
    "bidStartTime" TIMESTAMP(3) NOT NULL,
    "bidAmountUpdate" INTEGER,
    "currentBidAmount" INTEGER DEFAULT 0,
    "startBidAmount" DOUBLE PRECISION DEFAULT 0,
    "currentBidUserId" TEXT,
    "bidStatus" "VehicleBidStatusType" DEFAULT 'pending',
    "loanAgreementNo" TEXT NOT NULL DEFAULT '',
    "registeredOwnerName" TEXT NOT NULL DEFAULT '',
    "quoteIncreament" INTEGER DEFAULT 1000,
    "make" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT '',
    "varient" TEXT NOT NULL DEFAULT '',
    "categoty" TEXT NOT NULL DEFAULT '',
    "fuel" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "rcStatus" TEXT NOT NULL DEFAULT '',
    "yearOfManufacture" INTEGER,
    "ownership" INTEGER,
    "mileage" INTEGER,
    "kmReading" INTEGER DEFAULT 0,
    "insuranceStatus" TEXT NOT NULL DEFAULT '',
    "yardLocation" TEXT NOT NULL DEFAULT '',
    "startPrice" DOUBLE PRECISION DEFAULT 0,
    "reservePrice" DOUBLE PRECISION DEFAULT 0,
    "repoDt" TEXT,
    "veicleLocation" TEXT NOT NULL DEFAULT '',
    "vehicleRemarks" TEXT NOT NULL DEFAULT '',
    "auctionManager" TEXT NOT NULL DEFAULT '',
    "parkingCharges" TEXT NOT NULL DEFAULT '',
    "insurance" TEXT NOT NULL DEFAULT '',
    "insuranceValidTill" TEXT,
    "tax" TEXT NOT NULL DEFAULT '',
    "taxValidityDate" TEXT,
    "fitness" TEXT NOT NULL DEFAULT '',
    "permit" TEXT NOT NULL DEFAULT '',
    "fitnessPermit" TEXT NOT NULL DEFAULT '',
    "engineNo" TEXT NOT NULL DEFAULT '',
    "chassisNo" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "inspectionLink" TEXT NOT NULL DEFAULT '',
    "autobseContact" TEXT NOT NULL DEFAULT '',
    "autobse_contact_person" TEXT NOT NULL DEFAULT '',
    "vehicleCondition" TEXT NOT NULL DEFAULT '',
    "powerSteering" TEXT NOT NULL DEFAULT '',
    "shape" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "area" TEXT NOT NULL DEFAULT '',
    "paymentTerms" TEXT NOT NULL DEFAULT '',
    "dateOfRegistration" TEXT,
    "hypothication" TEXT NOT NULL DEFAULT '',
    "climateControl" TEXT NOT NULL DEFAULT '',
    "doorCount" INTEGER,
    "gearBox" TEXT NOT NULL DEFAULT '',
    "buyerFees" TEXT NOT NULL DEFAULT '',
    "rtoFine" TEXT NOT NULL DEFAULT '',
    "parkingRate" TEXT NOT NULL DEFAULT '',
    "approxParkingCharges" TEXT NOT NULL DEFAULT '',
    "clientContactPerson" TEXT NOT NULL DEFAULT '',
    "clientContactNo" TEXT NOT NULL DEFAULT '',
    "additionalRemarks" TEXT NOT NULL DEFAULT '',
    "lotNumber" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleCategory_name_key" ON "VehicleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_name_key" ON "Seller"("name");

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCategory" ADD CONSTRAINT "VehicleCategory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_currentBidUserId_fkey" FOREIGN KEY ("currentBidUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
