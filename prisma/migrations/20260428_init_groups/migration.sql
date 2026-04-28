-- Migration: init groups related tables (Groups MVP) for Phase B
CREATE TABLE IF NOT EXISTS "Group" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "inviteCode" VARCHAR(255) UNIQUE NOT NULL,
  "ownerWallet" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "GroupMember" (
  "id" VARCHAR(255) PRIMARY KEY,
  "groupId" VARCHAR(255) NOT NULL,
  "userWallet" VARCHAR(255) NOT NULL,
  "joinedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "fk_group" FOREIGN KEY ("groupId") REFERENCES "Group"("id"),
  CONSTRAINT "uniq_group_user" UNIQUE ("groupId", "userWallet")
);

CREATE TABLE IF NOT EXISTS "GroupInvite" (
  "id" VARCHAR(255) PRIMARY KEY,
  "groupId" VARCHAR(255) NOT NULL,
  "code" VARCHAR(255) UNIQUE NOT NULL,
  "expiresAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "fk_group_invite" FOREIGN KEY ("groupId") REFERENCES "Group"("id")
);

CREATE TABLE IF NOT EXISTS "Prediction1v1" (
  "id" VARCHAR(255) PRIMARY KEY,
  "challengerWallet" VARCHAR(255) NOT NULL,
  "opponentWallet" VARCHAR(255) NOT NULL,
  "matchId" VARCHAR(255),
  "contestId" VARCHAR(255),
  "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "resolvedAt" TIMESTAMPTZ
);
