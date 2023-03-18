import AccountSet from "@/components/AccountSet";
import PlaidLink from "@/components/PlaidLink";
import { db } from "@/lib/db";
import { cache } from "react";

const getAccounts = cache(async () => {
    return await db.item.findMany({
        include: {
            accounts: true,
        },
    });
});

export default async function Accounts() {
    const accountData = await getAccounts();

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
                    {accountData.map((item) => {
                        return (
                            <AccountSet
                                key={item.item_id}
                                accounts={item.accounts}
                                institution_name={item.institution_name}
                                record_id={item.id}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
