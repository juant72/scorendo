ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_groupId_fkey";

ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" 
  FOREIGN KEY ("groupId") REFERENCES "SocialGroup"("id") ON DELETE CASCADE;