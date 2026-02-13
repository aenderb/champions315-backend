-- CreateTable
CREATE TABLE "lineups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "team_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "formation" TEXT NOT NULL DEFAULT '4-3-1',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lineups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LineupStarters" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_LineupStarters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LineupBench" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_LineupBench_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "lineups_team_id_idx" ON "lineups"("team_id");

-- CreateIndex
CREATE INDEX "_LineupStarters_B_index" ON "_LineupStarters"("B");

-- CreateIndex
CREATE INDEX "_LineupBench_B_index" ON "_LineupBench"("B");

-- AddForeignKey
ALTER TABLE "lineups" ADD CONSTRAINT "lineups_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineupStarters" ADD CONSTRAINT "_LineupStarters_A_fkey" FOREIGN KEY ("A") REFERENCES "lineups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineupStarters" ADD CONSTRAINT "_LineupStarters_B_fkey" FOREIGN KEY ("B") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineupBench" ADD CONSTRAINT "_LineupBench_A_fkey" FOREIGN KEY ("A") REFERENCES "lineups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineupBench" ADD CONSTRAINT "_LineupBench_B_fkey" FOREIGN KEY ("B") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
