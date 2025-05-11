/*
  Warnings:

  - You are about to drop the column `saleEndDate` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `saleEndDate`,
    DROP COLUMN `salePrice`,
    ADD COLUMN `color` VARCHAR(50) NULL,
    ADD COLUMN `discount` DECIMAL(10, 2) NULL,
    ADD COLUMN `numReviews` INTEGER NULL DEFAULT 0,
    MODIFY `discountType` VARCHAR(191) NULL DEFAULT 'none';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `passwordConfirmed` BOOLEAN NULL DEFAULT false;
