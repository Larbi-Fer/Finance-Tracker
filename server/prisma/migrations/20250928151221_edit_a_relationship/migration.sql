/*
  Warnings:

  - The primary key for the `Budget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `currencyId` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Budget` DROP FOREIGN KEY `Budget_userId_fkey`;

-- AlterTable
ALTER TABLE `Budget` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `currencyId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`currencyId`, `categoryId`);

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
