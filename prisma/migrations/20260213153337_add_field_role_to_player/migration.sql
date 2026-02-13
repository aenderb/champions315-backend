-- CreateEnum
CREATE TYPE "FieldRole" AS ENUM ('RL', 'RCB', 'LCB', 'LL', 'RM', 'CM', 'LM', 'RW', 'ST', 'LW');

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "field_role" "FieldRole";
