import { client } from "@/lib/plaidClient";
import {
    RemovedTransaction,
    Transaction,
    TransactionsSyncRequest,
} from "plaid";

export async function POST(request: Request) {
    let { cursor, access_token } = await request.json();
    // New transaction updates since "cursor"
    let added: Array<Transaction> = [];
    let modified: Array<Transaction> = [];
    // Removed transaction ids
    let removed: Array<RemovedTransaction> = [];
    let hasMore = true;
    try {
        // Iterate through each page of new transaction updates for item
        while (hasMore) {
            const request: TransactionsSyncRequest = {
                access_token: access_token,
                cursor: cursor,
            };
            const response = await client.transactionsSync(request);
            const data = response.data;
            // Add this page of results
            added = added.concat(data.added);
            modified = modified.concat(data.modified);
            removed = removed.concat(data.removed);
            hasMore = data.has_more;
            // Update cursor to the next cursor
            cursor = data.next_cursor;
        }
    } catch (error) {
        console.log(`Error fetching transactions: ${error}`);
    }

    // Persist cursor and updated data
    // database.applyUpdates(itemId, added, modified, removed, cursor);
    // return new Response(JSON.stringify({ cursor: cursor }));
    // try {
    //     added.map(async (t) => {
    //         const data = {
    //             account_id: t.account_id,
    //             plaid_transaction_id: t.transaction_id,
    //             plaid_category_id: t.category_id,
    //             category: t.category ? t.category[0] : "",
    //             subcategory: t.category ? t.category[1] : "",
    //             name: t.name,
    //             amount: t.amount,
    //             iso_currency_code: t.iso_currency_code,
    //             unofficial_currency_code: t.unofficial_currency_code,
    //             date: t.date,
    //             pending: t.pending,
    //             account_owner: t.account_owner,
    //         };

    //         const res = await fetch(
    //             "http://127.0.0.1:8090/api/collections/transactions_table/records",
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(data),
    //             }
    //         );
    //         return res;
    //         // console.log(res);
    //     });
    // } catch (error) {
    //     console.log(`Error updating transactions: ${JSON.stringify(error)}`);
    // }
    // return new Response(JSON.stringify({ added }));
    for (let i = 0; i < added.length; i++) {
        // const element = added[i];
        let t = added[i];
        const data = {
            account_id: t.account_id,
            plaid_transaction_id: t.transaction_id,
            plaid_category_id: t.category_id,
            category: t.category ? t.category[0] : "",
            subcategory: t.category ? t.category[1] : "",
            name: t.name,
            amount: t.amount,
            iso_currency_code: t.iso_currency_code,
            unofficial_currency_code: t.unofficial_currency_code,
            date: t.date,
            pending: t.pending,
            account_owner: t.account_owner,
            type: t.payment_channel
        };
        const res = await fetch(
            "http://127.0.0.1:8090/api/collections/transactions_table/records",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        return res;
    }
    return new Response(JSON.stringify({ added }));
}
