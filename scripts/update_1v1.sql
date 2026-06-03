ALTER TABLE "Prediction1v1" ADD COLUMN "challengerPred" TEXT;
ALTER TABLE "Prediction1v1" ADD COLUMN "opponentPred" TEXT;
ALTER TABLE "Prediction1v1" ADD COLUMN "challengerPoints" INT DEFAULT 0;
ALTER TABLE "Prediction1v1" ADD COLUMN "opponentPoints" INT DEFAULT 0;