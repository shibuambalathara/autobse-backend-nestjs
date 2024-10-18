-- CreateTable
CREATE TABLE "EmdUpdate" (
    "id" TEXT NOT NULL,
    "emdNo" SERIAL NOT NULL,
    "vehicleBuyingLimitIncrement" INTEGER DEFAULT 1,
    "payment" TEXT,
    "user" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmdUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmdUpdate" ADD CONSTRAINT "EmdUpdate_payment_fkey" FOREIGN KEY ("payment") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmdUpdate" ADD CONSTRAINT "EmdUpdate_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmdUpdate" ADD CONSTRAINT "EmdUpdate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
