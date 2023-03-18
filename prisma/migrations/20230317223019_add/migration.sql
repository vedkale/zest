/*
  Warnings:

  - Added the required column `institution_name` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "access_token" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactions_cursor" TEXT
);
INSERT INTO "new_Item" ("access_token", "created_at", "id", "institution_id", "item_id", "transactions_cursor", "updated_at") SELECT "access_token", "created_at", "id", "institution_id", "item_id", "transactions_cursor", "updated_at" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_access_token_key" ON "Item"("access_token");
CREATE UNIQUE INDEX "Item_item_id_key" ON "Item"("item_id");
CREATE UNIQUE INDEX "Item_institution_id_key" ON "Item"("institution_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
