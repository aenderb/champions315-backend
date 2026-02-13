/*
  Warnings:

  - You are about to drop the column `coach_id` on the `teams` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_coach_id_fkey";

-- DropIndex
DROP INDEX "teams_coach_id_idx";

-- RenameColumn (seguro para dados existentes)
ALTER TABLE "teams" RENAME COLUMN "coach_id" TO "user_id";

-- CreateIndex
CREATE INDEX "teams_user_id_idx" ON "teams"("user_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
