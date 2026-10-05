-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER');

-- AlterTable: add plan price + balance due date (planPrice is made NOT NULL after backfill)
ALTER TABLE "Member" ADD COLUMN     "balanceDueBy" TIMESTAMP(3),
ADD COLUMN     "planPrice" INTEGER;

-- Backfill: existing rows only recorded "amount paid", so the best known plan price is that amount.
UPDATE "Member" SET "planPrice" = "amountPaid";

ALTER TABLE "Member" ALTER COLUMN "planPrice" SET NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- Preserve existing money: turn each member's old "amountPaid" into a ledger entry dated at their start date.
INSERT INTO "Payment" ("id", "memberId", "amount", "paidAt", "method", "note")
SELECT 'mig_' || "id", "id", "amountPaid", "startDate", 'CASH', 'Migrated from previous "amount paid" field'
FROM "Member"
WHERE "amountPaid" > 0;

ALTER TABLE "Member" DROP COLUMN "amountPaid";

-- CreateIndex
CREATE INDEX "Payment_memberId_idx" ON "Payment"("memberId");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
