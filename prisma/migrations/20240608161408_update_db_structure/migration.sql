/*
  Warnings:

  - You are about to drop the column `studentNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `UserModule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Enrolment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleCode` to the `UserModule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserModule" DROP CONSTRAINT "UserModule_moduleId_fkey";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "studentNo";

-- AlterTable
ALTER TABLE "UserModule" DROP COLUMN "moduleId",
ADD COLUMN     "moduleCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrolment_userId_key" ON "Enrolment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Module_code_key" ON "Module"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserModule" ADD CONSTRAINT "UserModule_moduleCode_fkey" FOREIGN KEY ("moduleCode") REFERENCES "Module"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
