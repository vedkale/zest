import AccountSet from "@/components/AccountSet";
import PlaidLink from "@/components/PlaidLink";
import { client } from "@/lib/plaidClient";
import { GetAllItemsResponse, ItemType } from "@/lib/types";
import {
    AccountsGetRequest,
    AccountsGetResponse,
    CountryCode,
    InstitutionsGetByIdRequest,
} from "plaid";
import { cache } from "react";

// AccountsGetResponse

interface AccountsGetResponseExtend extends AccountsGetResponse {
    recordId: string;
}

const getAllItems = async () => {
    const response = await fetch(
        "http://127.0.0.1:8090/api/collections/items_table/records",
        { cache: "no-store" }
    );
    const data: GetAllItemsResponse = await response.json();
    return data;
};

const getInstitutionById = cache(async (institution_id: string) => {
    const plaidRequest: InstitutionsGetByIdRequest = {
        institution_id: institution_id,
        country_codes: [CountryCode.Us],
        options: { include_optional_metadata: true },
    };
    const response = await client.institutionsGetById(plaidRequest);
    return response.data.institution;
});

const getAccountByToken = async (access_token: string) => {
    const plaidRequest: AccountsGetRequest = {
        access_token: access_token,
    };
    const response = await client.accountsGet(plaidRequest);
    return response.data;
};

export default async function Accounts() {
    const allItems = await getAllItems();

    const institutions = await Promise.all(
        allItems.items.map(async (item) => {
            return getInstitutionById(item.institution_id);
        })
    );
    const institution_names: { [key: string]: string } = {};

    institutions.forEach((ins, index) => {
        institution_names[allItems.items[index].institution_id] = ins.name;
    });

    const accounts: AccountsGetResponseExtend[] = await Promise.all(
        allItems.items.map(async (item) => {
            const a: any = await getAccountByToken(item.access_token);
            a.record_id = item.id;
            return a;
        })
    );
    console.log(accounts);

    return (
        <main>
            <div className="grid items-start gap-8">
                <div className="flex justify-between">
                    <h1 className="font-bold text-xl px-2 flex justify-between">
                        Accounts
                    </h1>
                    <PlaidLink />
                </div>

                <div className="flex-col space-y-4">
                    {accounts.map((item) => {
                        return (
                            <AccountSet
                                key={item.request_id}
                                accounts={item.accounts}
                                institution_name={
                                    institution_names[item.item.institution_id!]
                                }
                                record_id={item.record_id}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
