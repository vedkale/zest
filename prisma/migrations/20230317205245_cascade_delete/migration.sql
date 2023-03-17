-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transaction_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "pending_id" TEXT,
    "pending_date" DATETIME,
    "meta" TEXT,
    "account_owner" TEXT,
    "location" TEXT,
    "iso_currency" TEXT,
    "unofficial_name" BOOLEAN,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("account_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("account_id", "account_owner", "amount", "category", "category_id", "created_at", "date", "id", "iso_currency", "location", "meta", "name", "pending", "pending_date", "pending_id", "transaction_id", "unofficial_name", "updated_at") SELECT "account_id", "account_owner", "amount", "category", "category_id", "created_at", "date", "id", "iso_currency", "location", "meta", "name", "pending", "pending_date", "pending_id", "transaction_id", "unofficial_name", "updated_at" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_transaction_id_key" ON "Transaction"("transaction_id");
CREATE TABLE "new_Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mask" TEXT,
    "subtype" TEXT,
    "type" TEXT NOT NULL,
    "balance_available" REAL,
    "balance_current" REAL,
    "balance_date" DATETIME,
    "balance_limit" REAL,
    "balance_iso" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "item_id" TEXT NOT NULL,
    CONSTRAINT "Account_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("item_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("account_id", "balance_available", "balance_current", "balance_date", "balance_iso", "balance_limit", "created_at", "id", "item_id", "mask", "name", "subtype", "type", "updated_at") SELECT "account_id", "balance_available", "balance_current", "balance_date", "balance_iso", "balance_limit", "created_at", "id", "item_id", "mask", "name", "subtype", "type", "updated_at" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_account_id_key" ON "Account"("account_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
