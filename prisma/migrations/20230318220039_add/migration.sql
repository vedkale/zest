-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transaction_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "category_id" TEXT,
    "category" TEXT,
    "subcategory" TEXT,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "merchant_name" TEXT,
    "amount" REAL NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "iso_currency_code" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("account_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("account_id", "amount", "category", "category_id", "created_at", "date", "id", "iso_currency_code", "merchant_name", "name", "pending", "subcategory", "transaction_id", "updated_at") SELECT "account_id", "amount", "category", "category_id", "created_at", "date", "id", "iso_currency_code", "merchant_name", "name", "pending", "subcategory", "transaction_id", "updated_at" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_transaction_id_key" ON "Transaction"("transaction_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
