-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Signature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "department" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "logoUrl" TEXT,
    "socialLinks" TEXT,
    "templateId" TEXT NOT NULL,
    "primaryColor" TEXT,
    "fontFamily" TEXT,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "organizationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Signature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Signature_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Signature_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Signature" ("address", "company", "createdAt", "department", "email", "fontFamily", "id", "logoUrl", "mobile", "name", "phone", "primaryColor", "socialLinks", "teamId", "templateId", "title", "updatedAt", "userId", "website") SELECT "address", "company", "createdAt", "department", "email", "fontFamily", "id", "logoUrl", "mobile", "name", "phone", "primaryColor", "socialLinks", "teamId", "templateId", "title", "updatedAt", "userId", "website" FROM "Signature";
DROP TABLE "Signature";
ALTER TABLE "new_Signature" RENAME TO "Signature";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
