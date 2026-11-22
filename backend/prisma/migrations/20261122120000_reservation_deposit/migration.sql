-- AlterTable: existing reservations get their 30% deposit / 70% balance computed from the price
ALTER TABLE `Reservation` ADD COLUMN `balanceDue` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `depositAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `paymentIntentId` VARCHAR(191) NULL,
    ADD COLUMN `paymentStatus` ENUM('deposit_paid', 'refunded', 'non_refundable') NOT NULL DEFAULT 'deposit_paid';

UPDATE `Reservation`
SET `depositAmount` = ROUND(`price` * 0.3, 2),
    `balanceDue` = `price` - ROUND(`price` * 0.3, 2);

ALTER TABLE `Reservation` ALTER COLUMN `balanceDue` DROP DEFAULT,
    ALTER COLUMN `depositAmount` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Reservation_paymentIntentId_key` ON `Reservation`(`paymentIntentId`);
