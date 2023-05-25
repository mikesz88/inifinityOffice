/*
  Warnings:

  - Added the required column `capacity` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "businessId" TEXT,
    "userId" TEXT,
    CONSTRAINT "Room_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("businessId", "description", "id", "name", "userId") SELECT "businessId", "description", "id", "name", "userId" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_userId_key" ON "Room"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
