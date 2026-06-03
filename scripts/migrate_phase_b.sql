-- Phase B: Create Group, GroupMember, GroupInvite, Prediction1v1 tables
-- Run this manually in your PostgreSQL database (e.g., via psql or pgAdmin)

-- Create Group table
CREATE TABLE IF NOT EXISTS "Group" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT UNIQUE,
    "ownerWallet" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create GroupMember table
CREATE TABLE IF NOT EXISTS "GroupMember" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "groupId" TEXT NOT NULL,
    "userWallet" TEXT NOT NULL,
    "joinedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE
);

-- Create GroupInvite table
CREATE TABLE IF NOT EXISTS "GroupInvite" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "groupId" TEXT NOT NULL,
    "code" TEXT UNIQUE,
    "expiresAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE
);

-- Create Prediction1v1 table
CREATE TABLE IF NOT EXISTS "Prediction1v1" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "challengerWallet" TEXT NOT NULL,
    "opponentWallet" TEXT NOT NULL,
    "matchId" TEXT,
    "contestId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "resolvedAt" TIMESTAMPTZ
);