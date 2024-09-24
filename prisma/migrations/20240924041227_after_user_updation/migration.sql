-- CreateEnum
CREATE TYPE "EventStatusType" AS ENUM ('pending', 'blocked', 'active', 'inactive', 'stop', 'pause');

-- CreateEnum
CREATE TYPE "EventBidLockType" AS ENUM ('locked', 'unlocked');

-- CreateEnum
CREATE TYPE "VehicleBidStatusType" AS ENUM ('pending', 'approved', 'fulfilled', 'declined');

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('admin', 'staff', 'seller', 'dealer');

-- CreateEnum
CREATE TYPE "UserStatusType" AS ENUM ('pending', 'blocked', 'active', 'inactive');

-- CreateEnum
CREATE TYPE "StateNames" AS ENUM ('Maharashtra', 'Bihar', 'Chhattisgarh', 'Karnataka', 'Manipur', 'Arunachal_Pradesh', 'Assam', 'Gujarat', 'Punjab', 'Mizoram', 'Andhra_Pradesh', 'West_Bengal', 'Goa', 'Haryana', 'Himachal_Pradesh', 'Kerala', 'Rajasthan', 'Jharkhand', 'Madhya_Pradesh', 'Odisha', 'Nagaland', 'TamilNadu', 'Uttar_Pradesh', 'Telangana', 'Meghalaya', 'Sikkim', 'Tripura', 'Uttarakhand', 'Jammu_and_Kashmir', 'Delhi');

-- CreateEnum
CREATE TYPE "PaymentStatusTypes" AS ENUM ('approved', 'pending', 'rejected');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('registrations', 'emd', 'openBids');

-- CreateEnum
CREATE TYPE "ContactUsStatusType" AS ENUM ('created', 'solved');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('open', 'online');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "idNo" SERIAL NOT NULL,
    "dealerId" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "username" TEXT NOT NULL DEFAULT '',
    "businessName" TEXT NOT NULL DEFAULT '',
    "mobile" TEXT NOT NULL DEFAULT '',
    "password" TEXT,
    "BalanceEMDAmount" INTEGER DEFAULT 0,
    "pancardNo" TEXT NOT NULL DEFAULT '',
    "idProofNo" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "role" "UserRoleType" NOT NULL DEFAULT 'dealer',
    "state" "StateNames" NOT NULL,
    "userCategory" TEXT NOT NULL DEFAULT '',
    "tempToken" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "accessToken" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatusType" DEFAULT 'pending',
    "otp" TEXT,
    "otp_gen" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'india',
    "state" "StateNames" NOT NULL,
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
    "registrationNumber" TEXT NOT NULL,
    "bidTimeExpire" TIMESTAMP(3) NOT NULL,
    "bidStartTime" TIMESTAMP(3) NOT NULL,
    "bidAmountUpdate" INTEGER,
    "currentBidAmount" INTEGER DEFAULT 0,
    "startBidAmount" DOUBLE PRECISION DEFAULT 0,
    "currentBidUserId" TEXT,
    "eventId" TEXT,
    "bidStatus" "VehicleBidStatusType" DEFAULT 'pending',
    "loanAgreementNo" TEXT NOT NULL,
    "registeredOwnerName" TEXT NOT NULL DEFAULT '',
    "quoteIncreament" INTEGER DEFAULT 1000,
    "make" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT '',
    "varient" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "fuel" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "rcStatus" TEXT NOT NULL DEFAULT '',
    "YOM" INTEGER,
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

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventNo" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "firstVehicleEndDate" TIMESTAMP(3),
    "pauseDate" TIMESTAMP(3),
    "pausedTotalTime" INTEGER DEFAULT 0,
    "sellerId" TEXT,
    "vehicleCategoryId" TEXT,
    "locationId" TEXT,
    "noOfBids" INTEGER NOT NULL,
    "status" "EventStatusType" DEFAULT 'active',
    "downloadableFile_filename" TEXT,
    "termsAndConditions" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "bidLock" "EventBidLockType" DEFAULT 'unlocked',
    "extraTimeTrigerIn" INTEGER DEFAULT 2,
    "extraTime" INTEGER DEFAULT 2,
    "vehicleLiveTimeIn" INTEGER DEFAULT 0,
    "gapInBetweenVehicles" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "eventCategory" "EventCategory" NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcelUpload" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "file_filename" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExcelUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "status" "PaymentStatusTypes" NOT NULL DEFAULT 'pending',
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "refNo" SERIAL NOT NULL,
    "amount" INTEGER DEFAULT 10000,
    "description" TEXT NOT NULL DEFAULT '',
    "userId" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "registrationExpire" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "PaymentStatusTypes" DEFAULT 'pending',
    "createdById" TEXT,
    "paymentFor" "PaymentType" NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentSold" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "vehicleName" TEXT,
    "location" TEXT,
    "soldDate" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RecentSold_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "_Event_participants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_idNo_key" ON "User"("idNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_pancardNo_key" ON "User"("pancardNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_tempToken_key" ON "User"("tempToken");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleCategory_name_key" ON "VehicleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_name_key" ON "Seller"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_Event_participants_AB_unique" ON "_Event_participants"("A", "B");

-- CreateIndex
CREATE INDEX "_Event_participants_B_index" ON "_Event_participants"("B");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCategory" ADD CONSTRAINT "VehicleCategory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_currentBidUserId_fkey" FOREIGN KEY ("currentBidUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_vehicleCategoryId_fkey" FOREIGN KEY ("vehicleCategoryId") REFERENCES "VehicleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcelUpload" ADD CONSTRAINT "ExcelUpload_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Event_participants" ADD CONSTRAINT "_Event_participants_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Event_participants" ADD CONSTRAINT "_Event_participants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
