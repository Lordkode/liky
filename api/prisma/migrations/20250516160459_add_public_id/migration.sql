/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "images_publicId_key" ON "images"("publicId");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
