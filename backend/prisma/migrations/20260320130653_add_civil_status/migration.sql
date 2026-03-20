-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "civilStatus" TEXT NOT NULL DEFAULT 'SINGLE',
    "baptismDate" DATETIME,
    "memberSince" DATETIME,
    "imagePath" TEXT,
    "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Member" ("acceptTerms", "baptismDate", "birthDate", "cpf", "createdAt", "email", "id", "imagePath", "memberSince", "name", "phone", "rg", "role", "updatedAt") SELECT "acceptTerms", "baptismDate", "birthDate", "cpf", "createdAt", "email", "id", "imagePath", "memberSince", "name", "phone", "rg", "role", "updatedAt" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");
CREATE UNIQUE INDEX "Member_rg_key" ON "Member"("rg");
CREATE UNIQUE INDEX "Member_cpf_key" ON "Member"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
