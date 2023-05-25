/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ResetPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Room_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("businessId", "description", "id", "name") SELECT "businessId", "description", "id", "name" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
CREATE UNIQUE INDEX "Room_userId_key" ON "Room"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_userId_key" ON "ResetPassword"("userId");
