import { AccountBase } from "plaid";
import AccountItem from "./AccountItem";

export default function AccountSet({
    accounts,
    institution_name,
}: {
    accounts: AccountBase[];
    institution_name: string;
}) {
    return (
        <>
            <div className="border border-slate-300 rounded-xl divide-y divide-neutral-200">
                <div className="flex items-center justify-between p-4">
                    <div className="grid gap-1">
                        <p>{institution_name}</p>
                    </div>
                </div>
                {accounts.map((account) => {
                    return (
                        <AccountItem
                            key={account.account_id}
                            account={account}
                        />
                    );
                })}
            </div>
        </>
    );
}
