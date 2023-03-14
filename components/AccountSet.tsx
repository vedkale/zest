import { AccountBase } from "plaid";
import AccountItem from "./AccountItem";
import AccountOperations from "./AccountOperations";

export default function AccountSet({
    accounts,
    institution_name,
    record_id
}: {
    accounts: AccountBase[];
    institution_name: string;
    record_id: string;
}) {
    return (
        <>
            <div className="border border-slate-300 rounded-xl divide-y divide-neutral-200">
                <div className="flex items-center justify-between p-4">
                    <div className="grid gap-1">
                        <p>{institution_name}</p>
                    </div>
                    <AccountOperations record_id={record_id}/>
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
