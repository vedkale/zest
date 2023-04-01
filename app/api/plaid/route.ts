import { db } from "@/lib/db";
import { client } from "@/lib/plaidClient";
import { NextResponse } from "next/server";
import {
    AccountBase,
    CountryCode,
    LinkTokenCreateRequest,
    Products,
} from "plaid";
import { RequiredError } from "plaid/dist/base";
import { z } from "zod";

export async function GET(request: Request) {
    const plaidRequest: LinkTokenCreateRequest = {
        user: {
            client_user_id: "user-id",
        },
        client_name: "Plaid Test App",
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: "en",
    };

    try {
        const response = await client.linkTokenCreate(plaidRequest);
        return NextResponse.json({ token: response.data.link_token });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}

const itemCreateSchema = z.object({
    access_token: z.string(),
    item_id: z.string(),
    institution_id: z.string(),
    institution_name: z.string(),
    transactions_cursor: z.string().optional(),
});

const accountCreateSchema = z.object({
    account_id: z.string(),
    name: z.string(),
    mask: z.string().optional(),
    subtype: z.string().optional(),
    type: z.string(),
    balance_available: z.number().nullable().optional(),
    balance_current: z.number().nullable().optional(),
    balance_date: z.date().nullable().optional(),
    balance_limit: z.number().nullable().optional(),
    balance_iso: z.string().nullable().optional(),
    item_id: z.string(),
});

export async function POST(request: Request) {
    try {
        const { public_token, institution_id, institution_name } =
            await request.json();
        const response = await client.itemPublicTokenExchange({ public_token });

        const body = itemCreateSchema.parse({
            access_token: response.data.access_token,
            item_id: response.data.item_id,
            institution_id: institution_id,
            institution_name: institution_name,
        });

        const item = await db.item.create({
            data: {
                access_token: body.access_token,
                item_id: body.item_id,
                institution_id: body.institution_id,
                institution_name: body.institution_name,
            },
            select: {
                id: true,
            },
        });

        const accounts = await client.accountsGet({
            access_token: response.data.access_token,
        });

        accounts.data.accounts.map(async (account: AccountBase) => {
            const body = accountCreateSchema.parse({
                account_id: account.account_id,
                name: account.name,
                mask: account.mask,
                subtype: account.subtype,
                type: account.type,
                balance_available: account.balances.available,
                balance_current: account.balances.current,
                balance_date: account.balances.last_updated_datetime,
                balance_limit: account.balances.limit,
                balance_iso: account.balances.iso_currency_code,
                item_id: response.data.item_id,
            });

            await db.account.create({
                data: {
                    account_id: body.account_id,
                    name: body.name,
                    mask: body.mask,
                    subtype: body.subtype,
                    type: body.type,
                    balance_available: body.balance_available,
                    balance_current: body.balance_current,
                    balance_date: body.balance_date,
                    balance_limit: body.balance_limit,
                    balance_iso: body.balance_iso,
                    item_id: body.item_id,
                },
            });
        });
        return NextResponse.json(item);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(error.issues, { status: 422 });
        }
        if (error instanceof RequiredError) {
            console.log("plaid error?:" + error.field);
        }

        return NextResponse.json("error:" + JSON.stringify(error), {
            status: 500,
        });
    }
}
