/*
  Warnings:

  - Added the required column `currencyId` to the `income_sources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `income_sources` ADD COLUMN `currencyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `income_sources` ADD CONSTRAINT `income_sources_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
