-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('YELLOW', 'RED');

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "team_id" UUID NOT NULL,
    "opponent_name" TEXT NOT NULL,
    "team_score" INTEGER NOT NULL DEFAULT 0,
    "opponent_score" INTEGER NOT NULL DEFAULT 0,
    "date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_cards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "match_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "type" "CardType" NOT NULL,
    "minute" INTEGER,

    CONSTRAINT "match_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matches_team_id_idx" ON "matches"("team_id");

-- CreateIndex
CREATE INDEX "match_cards_match_id_idx" ON "match_cards"("match_id");

-- CreateIndex
CREATE INDEX "match_cards_player_id_idx" ON "match_cards"("player_id");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_cards" ADD CONSTRAINT "match_cards_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_cards" ADD CONSTRAINT "match_cards_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
