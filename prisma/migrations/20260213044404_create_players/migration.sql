-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GK', 'DEF', 'MID', 'FWD');

-- CreateTable
CREATE TABLE "players" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "team_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "avatar" TEXT,
    "position" "Position" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "players_team_id_idx" ON "players"("team_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
