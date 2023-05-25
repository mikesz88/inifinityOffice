-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "businessId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("businessId", "createdAt", "displayName", "email", "firstName", "id", "lastName", "role", "updatedAt") SELECT "businessId", "createdAt", "displayName", "email", "firstName", "id", "lastName", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
