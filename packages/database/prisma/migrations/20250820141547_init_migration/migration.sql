/*
  Warnings:

  - You are about to drop the column `clabe` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CLABE]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Account_clabe_key";

-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "clabe",
ADD COLUMN     "CLABE" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_CLABE_key" ON "public"."Account"("CLABE");
