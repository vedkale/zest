import AccountItem from "@/components/AccountItem";
import PlaidLink from "@/components/PlaidLink";
import { client } from "@/lib/plaidClient";
import { GetAllItemsResponse, ItemType } from "@/lib/types";
import {
    AccountBase,
    AccountsGetRequest,
    CountryCode,
    InstitutionsGetByIdRequest,
    InstitutionsGetByIdResponse,
} from "plaid";
import { cache } from "react";

const getAllItems = async () => {
    const response = await fetch(
        "http://127.0.0.1:8090/api/collections/items_table/records",
        { cache: "no-store" }
    );
    const data: GetAllItemsResponse = await response.json();
    // console.log(data);
    return data;
};
const getInstitutionById = cache(async (item: ItemType) => {
    const plaidRequest: InstitutionsGetByIdRequest = {
        institution_id: item.institution_id,
        country_codes: [CountryCode.Us],
        options: { include_optional_metadata: true },
    };
    const res = await client.institutionsGetById(plaidRequest);
    return res.data.institution;
});

const getAccountByToken = async (access_token: string) => {
    const plaidRequest: AccountsGetRequest = {
        access_token: access_token,
    };
    const response = await client.accountsGet(plaidRequest);
    return response.data.accounts;
};

export default async function Accounts() {
    const allItems = await getAllItems();
    // const accounts = allItems.items.map(async (item) => { return getInstitutionById(item) });
    // const institutions = allItems.items.map(async (item) => {[item.institution_id]: await getInstitutionById(item)});
    const institutions = async () => {Object.assign(
        {},
        allItems.items.map(async (item) => ({
            [item.institution_id]: await getInstitutionById(item),
        }))
    )};

    const accounts = await Promise.all(
        allItems.items.map(async (item) => {
            return getAccountByToken(item.access_token);
        })
    );

    return (
        <main>
            <div className="grid items-start gap-8">
                <div className="flex justify-between">
                    <h1 className="font-bold text-xl px-2 flex justify-between">
                        Accounts
                    </h1>
                    <PlaidLink />
                </div>

                <div className="border border-slate-300 rounded-xl divide-y divide-neutral-200">
                    {accounts.map((item) => {
                        return item.map((account) => {
                            return (
                                <AccountItem
                                    key={account.account_id}
                                    account={account}
                                />
                            );
                        });
                    })}
                </div>
            </div>
        </main>
    );
}
