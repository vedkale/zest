import { db } from "@/lib/db";
import { client } from "@/lib/plaidClient";
import { NextResponse } from "next/server";
import {
    RemovedTransaction,
    Transaction as PlaidTransaction,
    TransactionsSyncRequest,
} from "plaid";
import { cache } from "react";
import { z } from "zod";

const transactionCreateSchema = z.object({
    account_id: z.string(),
    amount: z.number(),
    iso_currency_code: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    subcategory: z.string().nullable().optional(),
    category_id: z.string().nullable().optional(),
    date: z.date(),
    name: z.string(),
    merchant_name: z.string().optional().nullable(),
    pending: z.boolean(),
    transaction_id: z.string(),
});

const getItem = cache(async (id: number) => {
    return await db.item.findUnique({
        where: {
            id: +id,
        },
    })
});

export async function GET(request: Request, context: { params: any }) {
    try {
        var startTime = performance.now();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return new Response("id is null", { status: 400 });

        const item = await getItem(+id);

        if (!item) {
            throw new Error("Item not found.");
        }

        let cursor: string | undefined = item.transactions_cursor as any; //ts really sucks

        // New transaction updates since "cursor"
        let added: Array<PlaidTransaction> = [];
        let modified: Array<PlaidTransaction> = [];
        // Removed transaction ids
        let removed: Array<RemovedTransaction> = [];
        let hasMore = true;

        // Iterate through each page of new transaction updates for item
        while (hasMore) {
            const request: TransactionsSyncRequest = {
                access_token: item.access_token,
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

        if (!(added.length || modified.length || removed.length))
        {
            console.info(`No new transactions. time: ${performance.now() - startTime}ms`);
            return NextResponse.json({
                added: added.length,
                removed: removed.length,
                updated: modified.length,
            });
        }

        //upsert probbly
        added.map(async (transaction) => {
            const body = transactionCreateSchema.parse({
                account_id: transaction.account_id,
                amount: transaction.amount,
                iso_currency_code: transaction.iso_currency_code,
                category: transaction.category?.[0],
                subcategory: transaction.category?.[1],
                category_id: transaction.category_id,
                date: new Date(transaction.date),
                name: transaction.name,
                merchant_name: transaction.merchant_name,
                pending: transaction.pending,
                transaction_id: transaction.transaction_id,
            });

            await db.transaction.create({
                data: {
                    account_id: body.account_id,
                    amount: body.amount,
                    iso_currency_code: body.iso_currency_code,
                    category: body.category,
                    subcategory: body.subcategory,
                    category_id: body.category_id,
                    date: body.date,
                    name: body.name,
                    merchant_name: body.merchant_name,
                    pending: body.pending,
                    transaction_id: body.transaction_id,
                },
            });
        });

        removed.map(async (transaction) => {
            await db.transaction.delete({
                where: {
                    transaction_id: transaction.transaction_id,
                },
            });
        });

        await db.item.update({
            where: {
                id: +id,
            },
            data: {
                transactions_cursor: cursor,
            },
        });

        console.info(`Call for puts took ${performance.now() - startTime} milliseconds`);

        return NextResponse.json({
            added: added.length,
            removed: removed.length,
            updated: modified.length,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(error.issues, { status: 422 });
        }
        console.error(`Error fetching transaction: ${error}`);
    }
}
