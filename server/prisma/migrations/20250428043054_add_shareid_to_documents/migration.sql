/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "shareId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Document_shareId_key" ON "Document"("shareId");
