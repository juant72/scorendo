CREATE TABLE "SocialGroup" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "inviteCode" TEXT UNIQUE,
    "ownerWallet" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);