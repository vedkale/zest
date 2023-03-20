/*
  Warnings:

  - You are about to drop the column `account_owner` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `iso_currency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `meta` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pending_date` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pending_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `unofficial_name` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `subcategory` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transaction_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
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
INSERT INTO "new_Transaction" ("account_id", "amount", "category", "category_id", "created_at", "date", "id", "name", "pending", "transaction_id", "updated_at") SELECT "account_id", "amount", "category", "category_id", "created_at", "date", "id", "name", "pending", "transaction_id", "updated_at" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_transaction_id_key" ON "Transaction"("transaction_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
